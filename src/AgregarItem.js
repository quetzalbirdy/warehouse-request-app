import React, { useState, useEffect } from 'react';
import MaterialIcon from 'material-icons-react';
import {    
    useHistory
  } from "react-router-dom";  
  import Modal from 'react-bootstrap/Modal'
  import {serviciosFlesan} from './api/servicios'
  import { useSelector, useDispatch } from 'react-redux'
  import { CircularProgress } from '@material-ui/core';
  import { filtroPadreCodeAdded, filtroPadreCodeClean, filtroSubCodeAdded, filtroSubCodeClean, filtroAdded, filtroClean, itemsAdded, itemsClean, buscadorAdded, buscadorClean } from './features/estadoApp/estadoAppSlice';

function AgregarItem() {  
  const [buscarValue, setBuscarValue] = useState('')
  const [buscando, setBuscando] = useState(false)
  /* const [itemsEncontrados, setItemsEncontrados] = useState('') */    
  const buscador = useSelector(state => state.estadoApp.buscador) 
  const itemsEncontrados = useSelector(state => state.estadoApp.items) 
  const codigoPadreFiltros = useSelector(state => state.estadoApp.filtroPadreCode)
  const codigoSubFiltros = useSelector(state => state.estadoApp.filtroSubCode)
  const centroCosto = useSelector(state => state.estadoApp.centroCosto)
  const company = useSelector(state => state.estadoApp.company)
  const [show, setShow] = useState(false)

  const dispatch = useDispatch()  

  const handleChange = async event => {        
    setBuscarValue(event.target.value)      
  } 

  const handleClose = () => setShow(false);

  const buscar = async (subCodigo, codigoPadre, porCategoria)  => {    
    var servicios = new serviciosFlesan();        
    dispatch(
      itemsClean()
    )  
    if (porCategoria) { 
      setBuscarValue('')       
      dispatch(
        buscadorClean()
      )     
      setBuscando(true)          
      await servicios.getItems(null, subCodigo ?? codigoSubFiltros, codigoPadre ?? codigoPadreFiltros, centroCosto.almacen, company).then((res) => {
        if (res.data != null) {
          dispatch(
            itemsAdded(res.data)
          )   
        } else {
          setShow(true)
        }
      });                      
    } else {    
      dispatch(
        filtroClean()
      )
      dispatch(
        filtroSubCodeClean()
      )  
      dispatch(
        filtroPadreCodeClean()
      )    
      dispatch(
        buscadorAdded(buscarValue)
      )   
      setBuscando(true)          
      await servicios.getItems(buscarValue.toUpperCase(), null, null, centroCosto.almacen, company).then((res) => {
        if (res.data != null) {
          dispatch(
            itemsAdded(res.data)
          )  
        } else {
          setShow(true)
        }
      });                
    }  
        
  }  

  const enter = event => {    
    if (event.key === 'Enter' || event.keyCode === 13) {
      buscar()
    }              
  }

  return (        
    <div className="fondo-app">     
      <Modal className="detalle-item__modal" show={show} onHide={handleClose}>       
          <Modal.Body>
            <div className="detalle-item__modal-cuerpo flex flex-column">
              <div className="detalle-item__modal-contenido flex">                             
                <div>                                    
                  <p>Hubo un problema en la integración con SAP, por favor intentar de nuevo mas tarde</p>                  
                </div>                                
              </div>
              <div className="contenedor-boton flex">
                <button type="button" className="boton-modal flex shadow" onClick={handleClose}>
                  Ok
                </button>
              </div>
            </div>
          </Modal.Body>        
        </Modal>   
      <div className="fondo-app__app-bar flex">
          <BackButton />
          <p className="t-center">Agregar item</p>
      </div>
      <div className="agregar-item flex">        
        
        <div className="agregar-item__contenedor flex flex-column">
          <div className="agregar-item__contenedor__barra-buscar flex">
            <div className="flex">              
              <input onKeyUp={enter} className='agregar-item__contenedor__barra-buscar__input' name='buscarValor' type="text" value={buscarValue} placeholder='Buscar' onChange={handleChange} />
            </div>
            <div className='flex'>
              <button className={(buscador !== '' ? ' con-filtro' : '')} onClick={buscar}><MaterialIcon icon="search"/></button>  
              <Filtros onBuscar={buscar} /> 
            </div>             
          </div>
          <ItemsList items={itemsEncontrados} buscando={buscando} />    
        </div>                     
      </div>        
    </div>
    );
}

function Filtros(props) {
  const [show, setShow] = useState(false);
  const [showError, setShowError] = useState(false);
  const [categorias, setCategorias] = useState('');
  const [subCategorias, setSubCategorias] = useState('')
  const [categoriaPadre, setCategoriaPadre] = useState('')     
  const categoriaSeleccionada = useSelector(state => state.estadoApp.filtro)  
  const company = useSelector(state => state.estadoApp.company)
  
  const dispatch = useDispatch()  

  const cerrarModal = (()=> {    
    setShow(false)
  })
  
  const seleccionPadre = ((subCategoria, categoriaPadre)=> {
    setSubCategorias(subCategoria)
    setCategoriaPadre(categoriaPadre)
    if (categoriaPadre !== null) {
      if (categoriaPadre !== categoriaSeleccionada.categoriaPadre) {
        dispatch(
          filtroAdded({ 
            categoriaPadre           
          })
        )
      } else {
        setSubCategorias('')
        dispatch(
          filtroClean()          
        )
        dispatch(
          filtroPadreCodeClean()
        )
        dispatch(
          filtroSubCodeClean()
        )
      }
    }    
  })

  const seleccionHijo = ((subCodigo, codigoPadre)=> {     
    dispatch(
      filtroPadreCodeAdded(codigoPadre)      
    )
    dispatch(
      filtroSubCodeAdded(subCodigo)
    )        
    /* console.log('codigos')
    console.log(codigosFiltros) */
    props.onBuscar(subCodigo, codigoPadre, true)
    cerrarModal()
  })    

  const handleShow = () => setShow(true);   
  
  const handleClose = () => setShowError(false);

  useEffect(() => {
    async function getCategorias() {
      var servicios = new serviciosFlesan();     
      await servicios.getCategorias(company).then((res) => {
        console.log(res) 
        if (res.Categorias != null) {
          setCategorias(res.Categorias)            
        } else {
          setShowError(true)
        }
      });  
    }
    getCategorias()
  }, [])  

  return (
    <>    
      <Modal className="detalle-item__modal" show={showError} onHide={handleClose}>       
          <Modal.Body>
            <div className="detalle-item__modal-cuerpo flex flex-column">
              <div className="detalle-item__modal-contenido flex">                             
                <div>                                    
                  <p>Hubo un problema en la integración con SAP, por favor intentar de nuevo mas tarde</p>                  
                </div>                                
              </div>
              <div className="contenedor-boton flex">
                <button type="button" className="boton-modal flex shadow" onClick={handleClose}>
                  Ok
                </button>
              </div>
            </div>
          </Modal.Body>        
        </Modal>   
      <button className={(categoriaSeleccionada !== '' ? ' con-filtro' : '')} onClick={handleShow}>
        <MaterialIcon icon="tune"/>
      </button>       
      <Modal className="agregar-item__filtros" show={show} onHide={cerrarModal}>
        <Modal.Header closeButton>
          
        </Modal.Header>
        <Modal.Body>
          <div className="agregar-item__filtros__categorias flex">            
            <div className="w-100 flex">              
              <div className="agregar-item__filtros__categorias__categoriasPadre flex">                
                {
                  (categorias ? 
                  categorias.sort((a, b) => a['Descripcion'].localeCompare(b['Descripcion'])).map((data, index) => (                
                    <button key={index} className={'shadow ' + (categoriaSeleccionada.categoriaPadre === data['Descripcion'] ? 'fondo-negro' : '')} onClick={() => seleccionPadre(data['SubCategoria'], data['Descripcion'])}>{data['Descripcion']}</button>
                  )) : 
                  <div className="flex circularProgress"><CircularProgress color="inherit" size="90px" thickness="2.0" /></div>)                    
                }                               
              </div>
              <div className="agregar-item__filtros__categorias__subCategorias flex">
                {
                  (function () {
                    if(subCategorias){
                      return (subCategorias.sort((a, b) => a['Descripcion'].localeCompare(b['Descripcion'])).map((data, index) => (                
                        <button key={index} className={'shadow ' + (categoriaSeleccionada.groupName === data['Descripcion'] ? 'fondo-negro' : '')} onClick={() => seleccionHijo(data['CodigoSub'], data['Code'])/* seleccionPadre(data['SubCategoria'], data['Descripcion']) */}>{data['Descripcion']}</button>
                      )))
                    } else if(categorias) {
                      return <div className="agregar-item__contenedor__vacio">
                        <p>Seleccione una categoría</p>
                      </div>
                    }
                  })()
                } 
              </div>
            </div>       
          </div>
        </Modal.Body>        
      </Modal>
    </>
  );
}

function ItemsList(props) {
  /* const filtroCategoria = useSelector(state => state.estadoApp.filtro) */   
  const items1 = Array.from(props.items)  
  const [mostrarModal, setMostrarModal] = useState(false);  
  const estaBusando = props.buscando;  
  
  const activarModal = () => {
    setMostrarModal(true) 
  }
  
  const materiales = items1[0] ? (/* filtroCategoria != '' ? props.items.filter(itemName => itemName.GroupName.toUpperCase() == filtroCategoria.groupName.toUpperCase()).sort((a, b) => a.ItemName.localeCompare(b.ItemName)).map((data, index) => (    
    <BotonItemLista data={data} />
  )) :  */items1[0].slice().sort((a, b) => a.ItemName.localeCompare(b.ItemName)).map((data, index) => (    
    <BotonItemLista key={index} data={data} onSeleccionar={activarModal} />
  ))) : null;

  const cerrarModal = () => {
    setMostrarModal(false) 
  }  
    
  if (materiales == null) {
    if (estaBusando) {
      return <div className="flex circularProgress"><CircularProgress color="inherit" size="90px" thickness="2.0" /></div>
    } else {
      return <div className="agregar-item__contenedor__vacio">
        <p>Ingresa una descripción en la búsqueda para encontrar items</p>
      </div>
    }
  } else {
    if (items1[0].length === 0) {
      return <div className="agregar-item__contenedor__vacio">
        <p>No coincidió ningún item con la búsqueda</p>
      </div>
    } else {
      return <div>
        {materiales}
        <MODALU_SYP_CODBAS mostrarModal={mostrarModal} onChangeMostrar={cerrarModal} />
        </div>
    }    
  }

  /* if (estaBusando) {
    if (materiales == null) {
      return <div className="flex circularProgress"><CircularProgress color="inherit" size="90px" thickness="2.0" /></div>
    } else {
      return <div>{materiales}</div>
    }          
  } else {
    return <div className="agregar-item__contenedor__vacio">
      <p>Ingresa una descripción en la búsqueda para encontrar items</p>
    </div>
  } */  
}

function MODALU_SYP_CODBAS(props) {
  const [show, setShow] = useState(props.mostrarModal);
  console.log(show.mostrarModal)

  useEffect(() => {
    setShow(props)
  }, [props])

  const handleClose = () => props.onChangeMostrar();  

  return (
    <>           
      <Modal className="detalle-item__modal" show={show.mostrarModal} onHide={handleClose}>       
        <Modal.Body>
          <div className="detalle-item__modal-cuerpo flex flex-column">
            <div className="detalle-item__modal-contenido flex">
              El campo 'Código base', del item seleccionado, está vacío
            </div>
            <div className="contenedor-boton flex">
              <button type="button" className="boton-modal flex shadow" onClick={handleClose}>
                Ok
              </button>
            </div>
          </div>
        </Modal.Body>        
      </Modal>
    </>
  );
}

function BotonItemLista(props) {
  let history = useHistory(); 

  function handleClick(codbas) {  
    if (codbas != null) {
      history.push({
        pathname: "/detalleItem",
        state: { item: props.data }
      });
    } else {
      props.onSeleccionar()
    }  
    /* if (props.data.U_SYP_CODBAS == null) {

    } else {
      history.push({
        pathname: "/detalleItem",
        state: { item: props.data }
      });
    } */    
  }

  return (
    <button className="item-main flex" onClick={() => {handleClick(props.data.U_SYP_CODBAS)}}>
      <div className="item__titulo">
        <p className="item__nombre">
          {props.data.ItemName}
        </p>
      </div>
      <div className="item__info-flecha flex">
        <div className="item__contenedor-elementos">          
          <div className="item__elementos flex">
            <div className="item__elementos__elemento flex">
              <div className="item__elementos__titulo">
                Disponible
              </div>
              <div className="item__elementos__contenido">
              {props.data.ItemWarehouseInfoCollection[0].InStock + ' ' + props.data.InventoryUOM}
              </div>
            </div>            
            {/* <div className="item__elementos__elemento">
              <div className="item__elementos__titulo">
                Grupo
              </div>
              <div className="item__elementos__contenido">
              {props.data.GroupName}
              </div>
            </div> */}
            <div>
              <div className="item__elementos__elemento">
                <div className="item__elementos__titulo">
                  Familia
                </div>
                <div className="item__elementos__contenido">
                  {props.data.U_SYP_FAMILIA_DESC}
                </div>
              </div>
              <div className="item__elementos__elemento">
                <div className="item__elementos__titulo">
                  Subfamilia
                </div>
                <div className="item__elementos__contenido">
                  {props.data.U_SYP_SUBFAMILIA_DESC}
                </div>
              </div>
            </div>
          </div>
        </div>
        <MaterialIcon icon="keyboard_arrow_right"/>
      </div>
      </button>
  );
}

function BackButton() {
    let history = useHistory();    
    
    function handleClick() {              
      history.push("/generarSolicitud");
    }
  
    return (
      <button type="button" className="flex" onClick={handleClick}>
        <MaterialIcon icon="arrow_back"/>  
      </button>
    );
  }

export default AgregarItem;
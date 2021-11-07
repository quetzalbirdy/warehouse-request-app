import React, { useState, useEffect } from 'react';
import MaterialIcon from 'material-icons-react';
import {    
    useHistory
  } from "react-router-dom";     
  import { materialUpdated, materialDeleted } from './features/estadoApp/estadoAppSlice';  
  import Modal from 'react-bootstrap/Modal'
  import { useSelector, useDispatch } from 'react-redux'
  import { serviciosFlesan } from './api/servicios';
  import Select from '@material-ui/core/Select';
  import MenuItem from '@material-ui/core/MenuItem';
  import LoadingOverlay from 'react-loading-overlay';

  export const EditarItem = ({ match }) => {
    const { materialId } = match.params 

    let material = useSelector(state => 
      state.estadoApp.materiales.find(material => material.id === materialId)  
    )

    const [cant, setCant] = useState('')        
    const [destino, setDestino] = useState('')
    const [mostrarModal, setMostrarModal] = useState(false)
    const [mostrarModalCantidad, setMostrarModalCantidad] = useState(false)
    const [dimension4, setDimension4] = useState('')
    const [dimension5, setDimension5] = useState('')
    const [dimensiones5, setDimensiones5] = useState('')
    const dimensiones4 = useSelector(state => state.estadoApp.dimension4)           
    const almacenes = useSelector(state => state.estadoApp.centroCosto.destinosAlmacen)
    const [cargando, setCargando] = useState(false)
    const [dim4Ini, setDim4Ini] = useState('');
    const [dim5Ini, setDim5Ini] = useState('');
    const [showModalDimension, setShowModalDimension] = useState(false)
    const [comentario, setComentario] = useState('')
    const company = useSelector(state => state.estadoApp.company)

    useEffect(() => {
      if (material) {
       setCant(material.cant)               
       setDestino(material.itemData.destino)       
       setDim5Ini(material.itemData.dimension5)
       setearDimension4()       
       setDimension5(material.itemData.dimension5)     
       setComentario(material.comentario)  
      };
    }, [dimensiones4]);

    const dispatch = useDispatch()

    const handleClose = () => setShowModalDimension(false);

    const onCantChanged = e => setCant(e.target.value)        

    let history = useHistory();
    
    const setearDimension4 = () => {
      for (var i = 0; i < dimensiones4.length; i++) {
        if (dimensiones4[i].CenterCode === material.itemData.dimension4.CenterCode) {
          setDimension4(dimensiones4[i])
          setDim4Ini(dimension4)
        }
      }
    }
    
    const updateMaterial = () => {
      var itemDetalle = {...material.itemData};      
      itemDetalle.dimension4 = dimension4;
      itemDetalle.dimension5 = dimension5;
      itemDetalle.destino = destino;
      if (cant && dimension4 && dimension5 && ((dimensiones5 === '') || (dim4Ini !== dimension4 && dim5Ini !== dimension5))) {
        if (material.itemData.ItemWarehouseInfoCollection[0].InStock < cant) {
          setMostrarModalCantidad(true)  
        } else {
          dispatch(
            materialUpdated({
                id: materialId,
                cant,                            
                itemData: itemDetalle,
                comentario
            })
          )    
          history.push("/generarSolicitud");
        }            
      } else {
        setMostrarModal(true)  
      }   
    }

    const eliminarMaterial = () => {
      dispatch(
        materialDeleted({
            materialId        
        })
      )
      history.push("/generarSolicitud");
    }

    const enter = e => {    
      if (e.key === 'Enter' || e.keyCode === 13) {
        updateMaterial()      
      }              
    }

    const cerrarModal = () => {
      setMostrarModal(false) 
    }
    const cerrarModalCantidad = () => {
      setMostrarModalCantidad(false) 
    }

    const handleChange4 = async (event) => {
      setDimension4(event.target.value);      
      setDimensiones5('')
      setCargando(true)
      var servicios = new serviciosFlesan();       
      /* material.itemData.dimension4 = dimension4  */
      await servicios.getDimensiones(5, event.target.value.CenterCode, company).then((res) => {
        if (res.data != null) {
          setDimensiones5(res.data.value)      
        } else {
          showModalDimension(true)
        }
      })               
      setCargando(false)
    };
    const handleChange5 = (event) => {
      setDimension5(event.target.value);
      /* material.itemData.dimension5 = dimension5 */
    };
    const handleDestino = (event) => {
      setDestino(event.target.value);      
      /* material.itemData.dimension5 = dimension5 */
    };
    const onComentChanged = e => setComentario(e.target.value) 

    if (!material) {
      history.push("/generarSolicitud");
    }

    return (
      <LoadingOverlay
        active={cargando}
        spinner
      >
        <div className="fondo-app">
          <div className="fondo-app__app-bar flex">
              <BackButton />
              <p className="t-center">Editar Item</p>
          </div>
          <div className="detalle-item__contenedor flex">                      
            <div className="detalle-item__contenedor__detalle">
              <ItemDetalle item={material} />
              <div className="detalle-item__contenedor__detalle__inputs">
                <p className="label-input">Cant. Solicitada</p>
                <input onKeyUp={enter} className="shadow" type="text" placeholder="Cant. Solicitada" value={cant || ""} onChange={onCantChanged}/>                            
                <p className="label-input">Fase</p>               
                <Select value={dimension4 || ""} onChange={handleChange4}>
                {         
                  dimensiones4 ? 
                  dimensiones4.map((data, index) => (                  
                  <MenuItem key={index} value={data}>{data.CenterName}</MenuItem>
                  )) : <MenuItem value={dimension4}>{dimension4.CenterName}{console.log('dimensiones', dimension4.CenterName)}</MenuItem>
                }
                </Select>
                <p className="label-input">Subfase</p>
                <Select value={(dimension5) ? dimension5 : ""} onChange={handleChange5}>            
                {
                  dimension5 && dimensiones5 ?
                  dimensiones5.map((data, index) => (
                    <MenuItem key={index} value={data}>{data.CenterName}</MenuItem>
                  )) : <MenuItem value={dimension5}>{dimension5.CenterName}</MenuItem>
                }
                </Select>
                {
                  almacenes.length > 0 ?
                  <div> 
                    <p className="label-input">Destino</p>              
                    <Select value={destino || ""} onChange={handleDestino}>   
                    <MenuItem key={'cero'} value={''}></MenuItem>                                           
                    {almacenes.map((data, index) => (
                      <MenuItem key={index} value={data}>{data.Nombre}</MenuItem>
                    ))} : <MenuItem value={destino}>{destino.Nombre}</MenuItem>                  
                    </Select>
                  </div> : null
                }
                <p className="label-input">Comentario</p>
                <input onKeyUp={enter} className="shadow" type="text" placeholder="Comentario" value={comentario} onChange={onComentChanged}/> 
              </div>
            </div>                    
            <div>
              <button type="button" className="boton-general boton-general-eliminar flex shadow w100 mb5" onClick={eliminarMaterial}>
              <MaterialIcon icon="delete"/>Eliminar item
              </button>
              <button type="button" className="boton-general flex shadow w100 mb5" onClick={updateMaterial}>
                Guardar
              </button>
            </div>
          </div>
          <Modal className="detalle-item__modal" show={showModalDimension} onHide={handleClose}>       
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
          <ModalValidador mostrarModal={mostrarModal} onChangeMostrar={cerrarModal}/>
          <ModalCantidad mostrarModal={mostrarModalCantidad} onChangeMostrar={cerrarModalCantidad}/>
        </div>
      </LoadingOverlay>
      );
  }  
  
  function ItemDetalle(props) {        
    return (
        <div className="item-main flex">
          <div className="item__titulo">
            <p className="item__nombre">
              {props.item.itemData.ItemName}
            </p>
          </div>
        <div className="item__info-flecha">
          <div className="item__contenedor-elementos">            
            <div className="item__elementos flex">
              <div className="item__elementos__elemento">
              <div className="item__elementos__titulo">
                Cant. disponible
              </div>
              <div className="item__elementos__contenido">
                {props.item.itemData.ItemWarehouseInfoCollection[0].InStock + ' ' + props.item.itemData.InventoryUOM}
              </div>
              </div>                           
              <div>
                <div className="item__elementos__elemento">
                  <div className="item__elementos__titulo">
                    Familia
                  </div>
                  <div className="item__elementos__contenido">
                    {props.item.itemData.U_SYP_FAMILIA_DESC}
                  </div>
                </div>
                <div className="item__elementos__elemento">
                  <div className="item__elementos__titulo">
                    Subfamilia
                  </div>
                  <div className="item__elementos__contenido">
                    {props.item.itemData.U_SYP_SUBFAMILIA_DESC}
                  </div>
                </div>
              </div>
              {/* <div>
                <div className="item__elementos__elemento">
                  <div className="item__elementos__titulo">
                    Código
                  </div>
                  <div className="item__elementos__contenido">
                    {props.item.itemData.ItemCode}
                  </div>
                </div></div>  */}
            </div>
            </div> 
        </div>           
        </div>
    );
  }

  function ModalCantidad(props) {
    const [show, setShow] = useState(props.mostrarModal);  
  
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
                La cantidad seleccionada no puede ser mayor a la disponible
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

  function ModalValidador(props) {
    const [show, setShow] = useState(props.mostrarModal);    
  
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
                Asegúrate de seleccionar al menos la Cantidad, la Fase y Subfase  
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
  
  function BackButton() {
      let history = useHistory();
    
      function handleClick() {      
        history.push("/generarSolicitud");
      }
    
      return (
        <button type="button" className="flex shadow" onClick={handleClick}>
          <MaterialIcon icon="arrow_back"/>  
        </button>
      );
    }      

    export default EditarItem;
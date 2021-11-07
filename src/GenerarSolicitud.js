import React, { useState, useEffect } from 'react';
import MaterialIcon from 'material-icons-react';
import {    
    useHistory
  } from "react-router-dom";  
import {serviciosFlesan} from './api/servicios'
import { useSelector, useDispatch } from 'react-redux'
import Modal from 'react-bootstrap/Modal'
import { dimension4Clean, materialClean, itemsClean, filtroClean, buscadorClean, dimension4Added, filtroSubCodeClean, filtroPadreCodeClean } from './features/estadoApp/estadoAppSlice';
import LoadingOverlay from 'react-loading-overlay';


export const GenerarSolicitud = () => {    
  const materiales = useSelector(state => state.estadoApp.materiales)    
  const [show, setShow] = useState(false)  
  const [cargando, setCargando] = useState(false)
  const company = useSelector(state => state.estadoApp.company)

  const handleClose = () => setShow(false);

  useEffect(() => {
    async function getDimension4()  {
      var servicios = new serviciosFlesan();  
      await servicios.getDimensiones(4, '', company).then((res) => {
        if (res.data != null) {
          dispatch(
            dimension4Added(res.data.value)
          )   
        } else {
          setShow(true)
        }
      })     
    }
    getDimension4()
  }, [])

  const dispatch = useDispatch()
  let history = useHistory();

  const enviando = () => {
    setCargando(true)      
  }

  const enviadoListo = () => {
    setCargando(false)  
  }

  const editarItem = (materialId) => {    
    history.push("/editarItem/" + materialId);    
  }   

  const renderedmateriales = materiales && materiales.map(material => (
    <button className="item-main flex" onClick={() => editarItem(material.id)} key={material.id}>
      <div className="item__titulo">
        <p className="item__nombre">
          {material.itemData.ItemName}
        </p>
      </div>
      <div className="item__info-flecha flex">
        <div className="item__contenedor-elementos">        
          <div className="item__elementos flex">
            <div className="item__elementos__elemento">
              <div className="item__elementos__titulo">
                Cant. solicitada
              </div>
              <div className="item__elementos__contenido">
                {material.cant + ' ' + material.itemData.InventoryUOM}
              </div>
            </div>           
            {/* <div className="item__elementos__elemento">
              <div className="item__elementos__titulo">
                Grupo
              </div>
              <div className="item__elementos__contenido">
              {material.itemData.GroupName}
              </div>
            </div>  */} 
            <div>
              <div className="item__elementos__elemento">
                <div className="item__elementos__titulo">
                  Familia
                </div>
                <div className="item__elementos__contenido">
                  {material.itemData.U_SYP_FAMILIA_DESC}
                </div>
              </div>
              <div className="item__elementos__elemento">
                <div className="item__elementos__titulo">
                  Subfamilia
                </div>
                <div className="item__elementos__contenido">
                  {material.itemData.U_SYP_SUBFAMILIA_DESC}
                </div>
              </div>
            </div>          
          </div>
        </div>
        <MaterialIcon icon="keyboard_arrow_right"/>
      </div>
    </button>    
  ))

  return (
    <LoadingOverlay
      active={cargando}
      spinner
    >
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
            <p className="t-center">Generando solicitud</p>
        </div>      
        <div className="generar-solicitud flex">                
          <Almacen />
          <div className="generar-solicitud__lista-items">
            <BotonAgregarItem />
            {materiales && renderedmateriales}
          </div>           

          <BotonEnviar onEnviar={enviando} onEnviado={enviadoListo} />
        </div>
      </div>
    </LoadingOverlay>
  )
}

function BackButton() {  
    let history = useHistory();
  
    function handleClick() {      
      history.push("/main");
    }
  
    return (
      <button type="button" className="flex" onClick={handleClick}>
        <MaterialIcon icon="arrow_back"/>  
      </button>
    );
  }

  function BotonEnviar(props) {
    const [show, setShow] = useState(false);  
    const [showItemsVacio, setShowItemsVacio] = useState(false);  
    const [error, setError] = useState('');      
    const listaItems = useSelector(state => state.estadoApp.materiales)
    const centroCosto = useSelector(state => state.estadoApp.centroCosto)
    const userCode = useSelector(state => state.estadoApp.userCode)    
    const company = useSelector(state => state.estadoApp.company)
    var servicios = new serviciosFlesan();                
    let history = useHistory();
    const dispatch = useDispatch()   
    var items = [];
  
    async function handleClick() {    
      if (listaItems.length === 0) {
        setShowItemsVacio(true)
      } else {
        for (var i = 0; listaItems.length > i; i++) {
          items.push(
            {
              "ItemCode": listaItems[i].itemData.ItemCode,
              "Quantity": listaItems[i].cant,
              "WarehouseCode": centroCosto.almacen,
              "FromWarehouseCode": centroCosto.almacen,
              "ProjectCode": centroCosto.ProjectCode,
              "DistributionRule": centroCosto.DistributionRule,
              "DistributionRule2": centroCosto.DistributionRule2,
              "DistributionRule3": listaItems[i].itemData.U_SYP_CODBAS.substring(0, 5),
              "DistributionRule4": listaItems[i].itemData.dimension4.CenterCode,
              "DistributionRule5": listaItems[i].itemData.dimension5.CenterCode,
              "U_SYP_DESTINO": listaItems[i].itemData.destino.Code,
              "U_SYP_REQCOM": listaItems[i].comentario
            }
          )
        }   
        props.onEnviar()   
        await servicios.enviarSolicitud(items, centroCosto.almacen, userCode, company).then((response) => {        
          if (response.data != null) {
            dispatch(
              materialClean()
            )
            dispatch(
              filtroSubCodeClean()
            )
            dispatch(
              filtroPadreCodeClean()
            )
            dispatch(
              dimension4Clean()
            )
            props.onEnviado() 
            history.push("/pantallaFinal");
          } else {
            props.onEnviado() 
            setError(response)
            console.log(response)
            setShow(true)
          }    
        });
      }            
    }

    const handleClose = () => setShow(false);
    const handleCloseItemsVacios = () => setShowItemsVacio(false);
  
    return (
      <div>
        <Modal className="detalle-item__modal" show={showItemsVacio} onHide={handleCloseItemsVacios}>       
          <Modal.Body>
            <div className="detalle-item__modal-cuerpo flex flex-column">
              <div className="detalle-item__modal-contenido flex">                             
                <div>                                    
                  <p>Para enviar una solicitud, es necesario haber seleccionado items</p>                  
                </div>                                
              </div>
              <div className="contenedor-boton flex">
                <button type="button" className="boton-modal flex shadow" onClick={handleCloseItemsVacios}>
                  Ok
                </button>
              </div>
            </div>
          </Modal.Body>        
        </Modal>
        <Modal className="detalle-item__modal" show={show} onHide={handleClose}>       
          <Modal.Body>
            <div className="detalle-item__modal-cuerpo flex flex-column">
              <div className="detalle-item__modal-contenido flex">
                {error !== '' ?                
                <div>
                  {/* <p>{'status: ' + error[1].toString()}</p> */}
                  <p>{'code: ' + error[0].errors.code.toString()}</p>   
                  <p>{'detalle: ' + error[0].errors.details.toString()}</p>                  
                </div>  : <div></div>                          
                }                
              </div>
              <div className="contenedor-boton flex">
                <button type="button" className="boton-modal flex shadow" onClick={handleClose}>
                  Ok
                </button>
              </div>
            </div>
          </Modal.Body>        
        </Modal>
        <button type="button" className="boton-general flex shadow" onClick={handleClick}>
          Enviar
        </button>
      </div>      
    );
  }

  function Almacen() {   
    const centroCosto = useSelector(state => state.estadoApp.centroCosto)        
  
    return (
      <div className="home__centro-gestion flex">
        <div className="generar-solicitud__almacen__titulo flex">
          {/* <FontAwesomeIcon icon={faBuilding} />    */}         
          <p>{'Almacen: ' + centroCosto.almacen}</p>
        </div>          
      </div>
      );
  }  

  function BotonAgregarItem() {
    let history = useHistory();
    const dispatch = useDispatch()
  
    function handleClick() {    
      dispatch(
        itemsClean(),                
      )   
      dispatch(
        filtroClean()
      )
      dispatch(
        buscadorClean()
      )
      dispatch(
        filtroSubCodeClean()
      )
      dispatch(
        filtroPadreCodeClean()
      )
      history.push("/agregarItem");
    }
  
    return (
      <button type="button" className="generar-solicitud__lista-items__agregar-item flex w100" onClick={handleClick}>
        <p>Agregar item</p>
        <MaterialIcon icon="add"/>  
      </button>
    );
  }

export default GenerarSolicitud;
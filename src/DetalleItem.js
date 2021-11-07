import React, { useEffect, useState } from 'react';
import MaterialIcon from 'material-icons-react';
import {   
  useHistory
} from "react-router-dom";   
import { useDispatch, useSelector } from 'react-redux';
import { materialAdded, itemsClean, filtroClean, buscadorClean } from './features/estadoApp/estadoAppSlice';
import { nanoid } from '@reduxjs/toolkit'
import Modal from 'react-bootstrap/Modal'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { serviciosFlesan } from './api/servicios';
import LoadingOverlay from 'react-loading-overlay';

export const DetalleItem = (props) => {
  const [cant, setCant] = useState('')    
  const [mostrarModal, setMostrarModal] = useState(false)
  const [mostrarModalCantidad, setMostrarModalCantidad] = useState(false)  
  const [dimension4, setDimension4] = useState('')
  const [dimension5, setDimension5] = useState('')
  const [dimensiones5, setDimensiones5] = useState('')
  const dimensiones4 = useSelector(state => state.estadoApp.dimension4)  
  const almacenes = useSelector(state => state.estadoApp.centroCosto.destinosAlmacen)
  const [almacen, setAlmacen] = useState('') 
  const [cargando, setCargando] = useState(false)
  const [showModalDimension, setShowModalDimension] = useState(false)
  const [comentario, setComentario] = useState('')
  const company = useSelector(state => state.estadoApp.company)

  const dispatch = useDispatch()

  const onCantChanged = e => (e.target.validity.valid) ? setCant(e.target.value) : cant  
  const onComentChanged = e => setComentario(e.target.value) 

  let history = useHistory();  

  const handleAlmacen = (event) => {
    console.log(event.target.value)
    setAlmacen(event.target.value);
  };
  
  const handleClick = () => {
    var itemDetalle = {...props.location.state.item};
    itemDetalle.dimension4 = dimension4;
    itemDetalle.dimension5 = dimension5;
    itemDetalle.destino = almacen;    
    if (cant && dimension4 && dimension5) {           
      if (props.location.state.item.ItemWarehouseInfoCollection[0].InStock < cant) {
        setMostrarModalCantidad(true)  
      } else {
        dispatch(
          materialAdded({
              id: nanoid(),
              cant,                            
              itemData: itemDetalle,
              comentario
          })
        )
        setCant('')                
        dispatch(
          itemsClean(),          
        )
        dispatch(
          filtroClean()
        )
        dispatch(
          buscadorClean()
        )
        history.push("/generarSolicitud");
      }      
    } else {
      setMostrarModal(true)  
    }    
  }
  const cerrarModal = () => {
    setMostrarModal(false) 
  }

  const handleClose = () => setShowModalDimension(false);

  const cerrarModalCantidad = () => {
    setMostrarModalCantidad(false) 
  }

  const enter = e => {    
    if (e.key === 'Enter' || e.keyCode === 13) {
      handleClick()      
    }              
  }

  const handleChange4 = async (event) => {    
    setDimension4(event.target.value);
    setDimensiones5('')
    setCargando(true)
    var servicios = new serviciosFlesan();        
    await servicios.getDimensiones(5, event.target.value.CenterCode, company).then((res) => {      
      if (res.data != null) {
        setDimensiones5(res.data.value) 
      } else {
        setShowModalDimension(true)
      }
    })        
    setCargando(false)
  };
  const handleChange5 = (event) => {
    setDimension5(event.target.value);
  };

  const vaciarDestino = () => {
    setAlmacen('')
  };

  return (
    <LoadingOverlay
      active={cargando}
      spinner    
    >
      <div className="fondo-app">
        <div className="fondo-app__app-bar flex">
            <BackButton />
            <p className="t-center">Detalle Item</p>
        </div>
        <div className="detalle-item__contenedor flex">                      
          <div className="detalle-item__contenedor__detalle">
            <ItemDetalle item={props.location.state.item} />
            <div className="detalle-item__contenedor__detalle__inputs">
              <p className="label-input">Cant. Solicitada</p>
              <input onKeyUp={enter} pattern="[0-9.]*" type="text" placeholder="Ingresar la cantidad deseada" value={cant} onChange={onCantChanged}/>                        
              <p className="label-input">Fase</p>
              <Select value={dimension4} onChange={handleChange4}>
              {
                dimensiones4.map((data, index) => (
                  <MenuItem key={index} value={data}>{data.CenterName}</MenuItem>
                ))
              }
              </Select>
              <p className="label-input">Subfase</p>
              <Select value={dimension5} onChange={handleChange5}>            
              {
                dimensiones5 ?
                dimensiones5.map((data, index) => (
                  <MenuItem key={index} value={data}>{data.CenterName}</MenuItem>
                )) : null
              }
              </Select>
              {
              almacenes.length > 0 ?
              <div>                         
                <div>
                  <p className="label-input">Destino</p>
                  <Select value={almacen} onChange={handleAlmacen}>            
                    <MenuItem key={'cero'} value={''}></MenuItem>
                    {almacenes.map((data, index) => (
                      <MenuItem key={index} value={data}>{data.Nombre}</MenuItem>
                    ))}
                  
                  </Select>
                </div>
              </div> : null }
              <p className="label-input">Comentario</p>
              <input onKeyUp={enter} type="text" placeholder="Comentario" value={comentario} onChange={onComentChanged}/> 
            </div>
          </div>            
          <button type="button" className="boton-general flex shadow" onClick={handleClick}>
            Agregar
          </button>
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
            {props.item.ItemName}
          </p>
        </div>
        <div className="item__info-flecha flex">
          <div className="item__contenedor-elementos">          
            <div className="item__elementos flex">
                <div className="item__elementos__elemento">
                <div className="item__elementos__titulo">
                    Cant. disponible
                </div>
                <div className="item__elementos__contenido">
                  {props.item.ItemWarehouseInfoCollection[0].InStock + ' ' + props.item.InventoryUOM}
                </div>
                </div>                
                {/* <div className="item__elementos__elemento">
                  <div className="item__elementos__titulo">
                      Grupo
                  </div>
                  <div className="item__elementos__contenido">
                  {props.item.GroupName}
                  </div>
                </div> */}
                <div>
                  <div className="item__elementos__elemento">
                    <div className="item__elementos__titulo">
                      Familia
                    </div>
                    <div className="item__elementos__contenido">
                      {props.item.U_SYP_FAMILIA_DESC}
                    </div>
                  </div>
                  <div className="item__elementos__elemento">
                    <div className="item__elementos__titulo">
                      Subfamilia
                    </div>
                    <div className="item__elementos__contenido">
                      {props.item.U_SYP_SUBFAMILIA_DESC}
                    </div>
                  </div>
                </div>
                {/* <div>
                  <div className="item__elementos__elemento">
                    <div className="item__elementos__titulo">
                        Código
                    </div>
                    <div className="item__elementos__contenido">
                    {props.item.ItemCode}
                    </div>
                  </div>
                </div> */}
            </div>
          </div> 
        </div>           
      </div>
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

function BackButton() {
    let history = useHistory();
  
    function handleClick() {      
      history.push("/agregarItem");
    }
  
    return (
      <button type="button" className="flex" onClick={handleClick}>
        <MaterialIcon icon="arrow_back"/>  
      </button>
    );
  }      

  export default DetalleItem;
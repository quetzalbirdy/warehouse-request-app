import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faBuilding, faDoorOpen, faHashtag, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import MaterialIcon from 'material-icons-react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {  
  useHistory
} from "react-router-dom";
import {serviciosFlesan} from './api/servicios'
import { useSelector, useDispatch } from 'react-redux'
import { CircularProgress } from '@material-ui/core';
import { centroCostoAdded } from './features/estadoApp/estadoAppSlice';
import Modal from 'react-bootstrap/Modal'
import PullToRefresh from 'react-simple-pull-to-refresh';

function Main() {      
  const centrosCostos = useSelector(state => state.estadoApp.centrosCosto)
  const centroCosto = useSelector(state => state.estadoApp.centroCosto)
  const [multiplesAlmacenes, setMultiplesAlmacenes] = useState(false)
  const [centroCostoSeleccionado, setCentroCostoSeleccionado] = useState('')  
  const dispatch = useDispatch()     

  const handleChangeCentroCosto = (event) => {
    setCentroCostoSeleccionado(event.target.value);
    dispatch(
      centroCostoAdded(event.target.value)
    )
  };

  /* const setearCentroCosto = () => {
    if (centrosCostos.length === 1) {
      setMultiplesAlmacenes(false)
    } else {
      setMultiplesAlmacenes(true)
    }  
    if (centrosCostos.length > 1 && centroCosto != null) {
      for (var i = 0; i < centrosCostos.length; i++) {
        if (centroCosto.centroCosto === centrosCostos[i].centroCosto) {
          centroCostoSeleccionado(centrosCostos[i])          
        }
      }
    } else {
      setCentroCostoSeleccionado(centrosCostos[0])
    }   
  } */
  
  useEffect(() => {
    function setearCentroCosto() {
      if (centrosCostos.length === 1) {
        setMultiplesAlmacenes(false)
      } else {
        setMultiplesAlmacenes(true)
      }  
      if (centrosCostos.length > 1 && centroCosto != null) {
        for (var i = 0; i < centrosCostos.length; i++) {
          if (centroCosto.centroCosto === centrosCostos[i].centroCosto) {
            setCentroCostoSeleccionado(centrosCostos[i])          
          }
        }
      } else {
        setCentroCostoSeleccionado(centrosCostos[0])
      }   
    }
    setearCentroCosto()
  }, [])

  let history = useHistory();
  function backArrow() {        
    history.push("/");
  }

  return (
    <div className="fondo-app">
      <div className="home flex">        
        <div className="flex">
          <div className="home__centro-gestion flex">
            <div className="home__centro-gestion__titulo flex">
              <button type="button" onClick={backArrow}>
                <FontAwesomeIcon icon={faArrowLeft} />   
              </button>                                   
            </div>          
          </div>
          <div className="home__centro-gestion flex">
            <div className="home__centro-gestion__titulo flex">
              <FontAwesomeIcon icon={faBuilding} />            
              {
                multiplesAlmacenes ? 
                <Select value={centroCostoSeleccionado} onChange={handleChangeCentroCosto}>
                {
                  centrosCostos.map((data, index) => (
                    <MenuItem key={index} value={data}>{data.CenterName.length > 28 ? data.CenterName.slice(0, 25) + '...' : data.CenterName}</MenuItem>
                  ))
                }
                </Select> 
                : <p>{centroCosto.CenterName.length > 28 ? centroCosto.CenterName.slice(0, 25) + '...' : centroCosto.CenterName}</p>
              }
            </div>          
          </div>
        </div>
        <div className="home__solicitudes flex">
          <TabsSolicitudes /> 
        </div>           

        <BotonGenerarSolicitud />
      </div>
    </div>
    );
}

function BotonGenerarSolicitud() {
  let history = useHistory();

  function handleClick() {    
    history.push("/generarSolicitud");
  }

  return (
    <button type="button" className="boton-general flex shadow" onClick={handleClick}>
      Crear solicitud
    </button>
  );
}

function TabsSolicitudes() {
  const [key, setKey] = useState('home');
  const [solicitudes, setSolicitudes] = useState('')
  const [solicitudesPasadas, setSolicitudesPasadas] = useState('')
  const almacen = useSelector(state => state.estadoApp.centroCosto.almacen)  
  const userCode = useSelector(state => state.estadoApp.userCode) 
  const company = useSelector(state => state.estadoApp.company)
  const [show, setShow] = useState(false)

  let history = useHistory(); 
  
  var getSolicitues = async () => {  
    setSolicitudes('')  
    setSolicitudesPasadas('')
    var servicios = new serviciosFlesan();     
    await servicios.getSolicitudes(almacen, userCode, null, company).then((respuesta) => {
      if (respuesta.data != null) {
        setSolicitudes(respuesta['data'])   
      } else {
        setShow(true)
      } 
    }); 
    await servicios.getSolicitudes(almacen, userCode, 'pasadas', company).then((respuestaPasadas) => {
      if (respuestaPasadas.data != null) {
        setSolicitudesPasadas(respuestaPasadas['data']) 
      } else {
        setShow(true)
      } 
    }); ;                  
  }

  const handleClose = () => setShow(false);

  useEffect(() => {    
    async function getSolicitues() {    
      setSolicitudes('')  
      setSolicitudesPasadas('')
      var servicios = new serviciosFlesan();     
      await servicios.getSolicitudes(almacen, userCode, null, company).then((respuesta) => {
        if (respuesta.data != null) {
          setSolicitudes(respuesta['data'])   
        } else {
          setShow(true)
        } 
      }); 
      await servicios.getSolicitudes(almacen, userCode, 'pasadas', company).then((respuestaPasadas) => {
        if (respuestaPasadas.data != null) {
          setSolicitudesPasadas(respuestaPasadas['data']) 
        } else {
          setShow(true)
        } 
      }); ;                  
    }
    getSolicitues()
  }, [almacen])

  var verDtalleSolicitud = (data) => {     
    history.push({
      pathname: "/detalleSolicitud",
      state: { data: data }
    });
  }

  return (
    <div>
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
      <PullToRefresh
        onRefresh={getSolicitues}
        isPullable={false}
      >
        <Tabs      
          activeKey={key}
          onSelect={(k) => setKey(k)}>      
          <Tab eventKey="home" title="Solicitudes actuales">
            <div className="home__solicitudes__contenido">
            {
            (solicitudes ? 
            solicitudes.length > 0 ? solicitudes.map((data, index) => {            
              let day = new Date(data.CreationDate).getDate() + 1
              let month = new Date(data.CreationDate).getMonth() + 1
              let year = new Date(data.CreationDate).getFullYear().toString().substr(-2)            
              return <button key={index} onClick={() => verDtalleSolicitud(data)}>                        
                <div className="home__solicitudes__contenido__solicitud flex">
                  <div className="flex">
                    <div className={"home__solicitudes__contenido__solicitud__icono " + (data.Estado === 'Atendida' ? 'fondo-verde' : data.Estado === 'Anulada' ? 'fondo-rojo' : 'fondo-amarillo')  + " flex"}>
                      <MaterialIcon icon="assignment"/>
                    </div>
                    <div className="home__solicitudes__contenido__solicitud__texto">
                      <div className="flex"><MaterialIcon icon="today"/><p>{(day+'-'+month+'-'+year)}</p></div>
                      <div className="flex"><FontAwesomeIcon icon={faHashtag} /><p>{data.DocNum}</p></div>
                      {(data.StockTransferLines[0].U_SYP_DESTINO != null) ?? <div className="flex">{/* <FontAwesomeIcon icon={faHashtag} /> */}<p>Destino: {data.StockTransferLines[0].U_SYP_DESTINO}</p></div>}
                    </div>
                  </div>
                  <div className="home__solicitudes__contenido__solicitud__flecha flex">
                    <MaterialIcon icon="chevron_right"/>
                  </div>
                </div> 
              </button>
            }) : <div className="agregar-item__contenedor__vacio">
                  <p>No tiene solicitudes...</p>
                </div> :
            <div className="flex circularProgress"><CircularProgress color="inherit" size="90px" thickness={2.0} /></div>)                    
          }          
            </div>
          </Tab>
          <Tab eventKey="profile" title="Solicitudes pasadas">
            <div className="home__solicitudes__contenido">                      
                {
                  (solicitudesPasadas ? 
                  solicitudesPasadas.length > 0 ? solicitudesPasadas.map((data, index) => {            
                    let day = new Date(data.CreationDate).getDate() + 1
                    let month = new Date(data.CreationDate).getMonth() + 1
                    let year = new Date(data.CreationDate).getFullYear().toString().substr(-2)                   
                    return <button key={index} onClick={() => verDtalleSolicitud(data)}>                        
                      <div className="home__solicitudes__contenido__solicitud flex">
                        <div className="flex">
                          <div className={"home__solicitudes__contenido__solicitud__icono " + (data.Estado === 'Atendida' ? 'fondo-verde' : data.Estado === 'Anulada' ? 'fondo-rojo' : data.Estado === 'Consumida' ? 'fondo-gris' : 'fondo-amarillo')  + " flex"}>
                            <MaterialIcon icon={(data.Estado === 'Atendida' ? 'assignment_turned_in' : data.Estado === 'Anulada' ? 'assignment_late' : data.Estado === 'Consumida' ? 'assignment' : 'assignment_turned_in')}/>
                          </div>
                          <div className="home__solicitudes__contenido__solicitud__texto">
                            <div className="flex"><MaterialIcon icon="today"/><p>{(day+'-'+month+'-'+year)}</p></div>
                            <div className="flex"><FontAwesomeIcon icon={faHashtag} /><p>{data.DocNum}</p></div>
                            {(data.StockTransferLines[0].U_SYP_DESTINO != null) ?? <div className="flex">{/* <FontAwesomeIcon icon={faHashtag} /> */}<p>Destino: {data.StockTransferLines[0].U_SYP_DESTINO}</p></div>}
                          </div>
                        </div>
                        <div className="home__solicitudes__contenido__solicitud__flecha flex">
                          <MaterialIcon icon="chevron_right"/>
                        </div>
                      </div> 
                    </button>
                  }) : <div className="agregar-item__contenedor__vacio">
                        <p>No tiene solicitudes...</p>
                      </div> :
                  <div className="flex circularProgress"><CircularProgress color="inherit" size="90px" thickness={2.0} /></div>)                    
                }
              </div>
          </Tab>      
        </Tabs>
      </PullToRefresh>
    </div>       
  );
}

export default Main;
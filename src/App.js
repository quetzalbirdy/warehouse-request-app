import React, { useEffect, useState } from 'react';
import './index.css';
import logo from './assets/images/logo1.png';
import {  
  Switch,
  Route,  
  useHistory
} from "react-router-dom";
import Main from './Main';
import Modal from 'react-bootstrap/Modal'
import GenerarSolicitud from './GenerarSolicitud';
import DetalleSolicitud from './DetalleSolicitud';
import AgregarItem from './AgregarItem';
import DetalleItem from './DetalleItem';
import PantallaFinal from './PantallaFinal';
import EditarItem from './EditarItem';
import {serviciosFlesan} from './api/servicios'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import hideVirtualKeyboard from 'hide-virtual-keyboard';
import { useDispatch, useSelector } from 'react-redux';
import { companyAdded, centroCostoAdded, centroCostosAdded, userCodeAdded, mailAdded } from './features/estadoApp/estadoAppSlice';
import LoadingOverlay from 'react-loading-overlay';

export default function App() {
    return (
      <Switch>
        <Route exact path="/" component={Login} />     
        <Route exact path="/main" component={Main} /> 
        <Route exact path="/generarSolicitud" component={GenerarSolicitud} /> 
        <Route exact path="/detalleSolicitud" component={DetalleSolicitud} /> 
        <Route exact path="/agregarItem" component={AgregarItem} /> 
        <Route exact path="/detalleItem" component={DetalleItem} /> 
        <Route exact path="/pantallaFinal" component={PantallaFinal} /> 
        <Route exact path="/editarItem/:materialId" component={EditarItem} /> 
      </Switch>
    )
}

function Login(props) {
     /* const [email, setEmail] = useState('');
     const [pass, setPass] = useState(''); */     
     const [show, setShow] = useState(false);  
     const [showCompania, setShowCompania] = useState(false);  
     const [companyList, setCompanyList] = useState([])
     const [selectedCompany, setSelectedCompany] = useState('')
     const [cargandoOverlay, setCargandoOverlay] = useState(false)
     const company = useSelector(state => state.estadoApp.company)
     const mailEstado = useSelector(state => state.estadoApp.mail)
     const dispatch = useDispatch()
     
     let history = useHistory();  
     var servicios = new serviciosFlesan();   

     const handleClose = () => setShow(false);    
     const handleCloseCompania = () => console.log('');             

    useEffect(() => {   
      async function startApp() {        
        await servicios.getCompany().then((respuesta) => {          
          if (respuesta.data != null) {   
            setCompanyList(respuesta.data)   
            setShowCompania(true)         
            /* dispatch(
              centroCostosAdded(respuesta.data.centroCostos)
            )
            dispatch(
              centroCostoAdded(respuesta.data.centroCostos[0])
            )
            dispatch(
              userCodeAdded(respuesta.data.UserCode)
            )
            document.activeElement.blur();
            hideVirtualKeyboard();       */
            /* history.push("/main"); */
            /* setShowCompania(true) */
          } else {
            setShow(true)
          }    
        })                  
      }   
      startApp()
    }, [])              
   
    const handleSelectChange = async (event) => {  
      console.log(event.target.value)  
      setSelectedCompany(event.target.value);
      dispatch(
        companyAdded(event.target.value)
      )
    };     

    const selectCompany = async () => {      
      if (selectedCompany) {
        setCargandoOverlay(true)
        setShowCompania(false)
        await servicios.login(mailEstado ? mailEstado : props.location.search.substring(1), company).then((respuesta) => {
          if (respuesta.data != null) {
            if (!mailEstado && props.location.search.substring(1)) {
              dispatch(
                mailAdded(props.location.search.substring(1))
              )
            }            
            dispatch(
              centroCostosAdded(respuesta.data.centroCostos)
            )
            dispatch(
              centroCostoAdded(respuesta.data.centroCostos[0])
            )
            dispatch(
              userCodeAdded(respuesta.data.UserCode)
            )
            document.activeElement.blur();
            hideVirtualKeyboard();      
            history.push("/main");
            setShowCompania(true)
          } else {
            setShowCompania(true)
            setCargandoOverlay(false)
            setShow(true)
          }    
        })   
      }
    }  
  
    return (
      <LoadingOverlay
        active={cargandoOverlay}
        spinner
      >  
        <div className="fondo-app-login flex">
          <Modal className="detalle-item__modal" show={show} onHide={handleClose}>       
            <Modal.Body>
              <div className="detalle-item__modal-cuerpo flex flex-column">
                <div className="detalle-item__modal-contenido flex">                             
                  <div>                                    
                    <p>No se pudo realizar el login. Pruebe nuevamente o intente con otro usuario</p>                  
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
          <Modal className="detalle-item__modal" show={showCompania} onHide={handleCloseCompania}>       
            <Modal.Body>
              <div className="detalle-item__modal-cuerpo flex flex-column">
                <div className="detalle-item__modal-contenido flex">                             
                  <div>                                    
                    <p>Seleccionar compañía</p>    
                    <Select value={selectedCompany} onChange={handleSelectChange}>
                    {
                      companyList.map((data, index) => (
                        <MenuItem key={index} value={data.value}>{data.name.length > 30 ? data.name.slice(0, 27) + '...' : data.name}</MenuItem>
                      ))
                    }
                    </Select>              
                  </div>                                
                </div>
                <div className="contenedor-boton flex">
                  <button type="button" className="boton-modal flex shadow" onClick={selectCompany}>
                    Ok
                  </button>
                </div>
              </div>
            </Modal.Body>        
          </Modal> 
            <div>            
              <img src={logo} alt='logo'/>
            </div>       
            <form className='flex' /* onSubmit={this.handleSubmit} */>         
              {/* <label><input className='input' name='nameValue' type="text" value={email} placeholder='Email' onChange={handleName} /></label> */}
              {/* <label><input className='input' name='passValue' type="password" value={pass} placeholder='Clave' onChange={handlePass} /></label> */}
              {/* <p>{servicio != '' ? servicio : ''}</p> */}
              {/* <input type="submit" value="Login" />  */}                         
            </form>       
            {/* <LoginButton name={email} pass={pass} />       */}    
        </div>
      </LoadingOverlay>
      )
  }

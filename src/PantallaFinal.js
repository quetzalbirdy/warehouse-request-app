import React from 'react';
import MaterialIcon from 'material-icons-react';
import {    
    useHistory
  } from "react-router-dom";  

  class PantallaFinal extends React.Component {
    render() {
        return (
        <div className="fondo-app">
          <div className="pantalla-final flex">
            <div className="pantalla-final__contenedor flex">
              <MaterialIcon icon="done"/> 
              <p>Muchas gracias, su solicitud ha sido enviada</p>
            </div>
            <BotonEnviar />
          </div>
        </div>
        );
    }
  }
      
    function BotonEnviar() {
      let history = useHistory();
    
      function handleClick() {    
        history.push("/main");
      }
    
      return (
        <button type="button" className="boton-general flex shadow" onClick={handleClick}>
          Volver al inicio
        </button>
      );
    }      
export default PantallaFinal;
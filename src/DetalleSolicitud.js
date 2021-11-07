import React from 'react';
import MaterialIcon from 'material-icons-react';
import {useHistory} from "react-router-dom";  

export const DetalleSolicitud = (props) => {          
  const renderedmateriales = props.location.state.data.StockTransferLines.map(material => (
    <div key={material.ItemCode} className="item-main flex">
          <div className="item__titulo">
            <p className="item__nombre">
              {material.ItemDescription}
            </p>
          </div>
        <div className="item__info-flecha">
          <div className="item__contenedor-elementos">            
            <div className="item__elementos flex">
              <div className="item__elementos__elemento">
              <div className="item__elementos__titulo">
                Cant. solicitada
              </div>
              <div className="item__elementos__contenido">
                {material.Quantity + ' ' + material.MeasureUnit}
              </div>
              </div>                           
              <div>
                <div className="item__elementos__elemento">
                  <div className="item__elementos__titulo">
                    Familia
                  </div>
                  <div className="item__elementos__contenido">
                    {material.U_SYP_FAMILIA_DESC}
                  </div>
                </div>
                <div className="item__elementos__elemento">
                  <div className="item__elementos__titulo">
                    Subfamilia
                  </div>
                  <div className="item__elementos__contenido">
                    {material.U_SYP_SUBFAMILIA_DESC}
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
  ))

  return (
    <div className="fondo-app">
      <div className="fondo-app__app-bar flex">
          <BackButton />
          <p className="t-center">Detalle solicitud</p>
      </div>
      <div className="generar-solicitud flex">        
        
        
        <div className="generar-solicitud__lista-items">    
          <div className={"generar-solicitud__lista-items__estado " + (props.location.state.data.Estado === 'Atendida' ? 'fondo-verde' : props.location.state.data.Estado === 'Anulada' ? 'fondo-rojo' : 'fondo-amarillo')}>
            {props.location.state.data.Estado}
          </div>
          {renderedmateriales}
        </div>                   
      </div>
    </div>
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

export default DetalleSolicitud;
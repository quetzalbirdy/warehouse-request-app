import axios from 'axios';
import http from 'http';
import { useSelector } from 'react-redux'

var config = {
  baseURL: '#/api/rest',
  httpAgent: new http.Agent({ keepAlive: true }),
  headers: {
    'content-type': 'application/application/json;charset=utf-8',    
  },
  method: 'get',
  timeout: 15000
};

export class serviciosFlesan {     

  login = async (mail, company) => {
    let respuesta;        
    let configLocal = config;
    configLocal.url = "/login.xsjs/2?$filter=eMail eq '" + mail + "'";
    configLocal.method = 'get';
    configLocal.headers['x-ch-company'] = company
    console.log(configLocal) 
    await axios(configLocal)
    .then((response) => {
      respuesta = response.data;
    })
    .catch(function (error) {
      respuesta = error
      console.log('error', respuesta)
    });
    return respuesta
  }    

  getCompany = async () => {
    let respuesta;    
    let configLocal = config;    
    configLocal.url = "/company.xsjs/2";
    configLocal.method = 'get';
    console.log(configLocal) 
    await axios(configLocal)
    .then((response) => {
      respuesta = response.data;
      console.log(respuesta)
    })
    .catch(function (error) {
      respuesta = error
      console.log('error', respuesta)
    });
    return respuesta
  }    

  getItems = async (filter, subCodigo, codigoPadre, almacen, company) => {      
    let respuesta;     
    let configLocal = config;     
    configLocal.url = (subCodigo && codigoPadre && !filter) ? "/item.xsjs/2?$select=InventoryUOM,ItemCode,InventoryUOM&$filter=U_SYP_FAMILIA eq \'" + codigoPadre + "\' and U_SYP_SUBFAMILIA eq \'" + subCodigo + "\' and Items/ItemWarehouseInfoCollection/WarehouseCode eq \'" + almacen + "\'" : "/item.xsjs/2?$select=InventoryUOM,ItemCode&$filter=contains(ItemName,'" + filter + "') and Items/ItemWarehouseInfoCollection/WarehouseCode eq \'" + almacen + "\'";
    configLocal.method = 'get';          
    configLocal.headers['x-ch-company'] = company  
    await axios(configLocal)
    .then(function (response) {
      respuesta = response.data;
    })
    .catch(function (error) {
      respuesta = error
      console.log('error', respuesta)
    });
    return respuesta
  }

  getCategorias = async (company) => {    
    let respuesta;    
    let configLocal = config;      
    configLocal.url = "/categoryList.xsjs/2";
    configLocal.method = 'get';         
    configLocal.headers['x-ch-company'] = company      
    await axios(configLocal)
    .then(function (response) {
      respuesta = response.data;
    })
    .catch(function (error) {
      respuesta = error
      console.log('error', respuesta)
    });
    return respuesta
  }

  getDimensiones = async (dimension, groupCode, company) => {    
    let respuesta;    
    let configLocal = config;      
    configLocal.url = dimension === 4 ? "/proficCenters.xsjs/2?$filter=InWhichDimension eq 4 and Active eq 'tYES'&$select=CenterCode, CenterName" : "/proficCenters.xsjs/2?$filter=InWhichDimension eq 5 and Active eq 'tYES' and GroupCode eq '" + groupCode + "'&$select=CenterCode, CenterName";
    configLocal.method = 'get';         
    configLocal.headers['x-ch-company'] = company   
    await axios(configLocal)
    .then(function (response) {
      respuesta = response.data;
    })
    .catch(function (error) {
      respuesta = error
      console.log('error', respuesta)
    });
    return respuesta
  }

  getSolicitudes = async (almacen, userCode, tipo, company) => {        
    let respuesta;    
    let configLocal = config;      
    configLocal.url = "/inventoryTransfer.xsjs/2?$filter=InventoryTransferRequests/U_SYP_SOLICITANTE eq '" + userCode + "' and ToWarehouse eq '" + almacen + "'&$tipo=" + ( (tipo === 'pasadas') ? '1' : '0' ) + "";
    configLocal.method = 'get';  
    configLocal.headers['x-ch-company'] = company  
    /* configLocal.timeout = 15000       */
    console.log(configLocal)    
    await axios(configLocal)
    .then(function (response) {
      respuesta = response.data;
    })
    .catch(function (error) {
      respuesta = error
      console.log('error', respuesta)
    });
    return respuesta
  }

  enviarSolicitud = async (items, almacen, solicitante, company) => {
    let respuesta;    
    let configLocal = config;             
    const fechaActual = new Date();
    const fechaFormat = fechaActual.getFullYear() + '-' + (fechaActual.getMonth()+1) + '-' + fechaActual.getDate();
    const data = {
      "U_SYP_MDMT" : "92",
      "U_SYP_ALMACENERO" : "APP CONSUMO",
      "U_SYP_MDTS" : "TSI",
      "DocDate": fechaFormat,
      "DueDate": fechaFormat,
      /* "CardCode": null, */
      "Comments": "generado desde app mobile",
      "FromWarehouse": almacen,
      "ToWarehouse": almacen,
      "TaxDate": fechaFormat,
      "U_SYP_SOLICITANTE": solicitante,
      "StockTransferLines": items
    }
    console.log(data)
    configLocal.url = "/inventoryTransfer.xsjs/2";
    configLocal.method = 'post';  
    configLocal.headers['x-ch-company'] = company  
    configLocal.data = data    
    console.log(configLocal) 
    await axios(configLocal)
    .then((response) => {
      respuesta = response.data;
      console.log(respuesta)
    })
    .catch(function (error) {
      if (error.response) {
        // Request made and server responded        
        respuesta = [
          error.response.data,
          error.response.status,          
        ]
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
  
    });
    return respuesta
  }
}
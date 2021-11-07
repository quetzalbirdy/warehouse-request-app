import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: '',
  mail: '',
  company: '',
  materiales: [],
  items: [],
  buscador: '',
  filtro: '',
  filtroSubCode: '',
  filtroPadreCode: '',
  dimension4: [],
  userCode: '',
  centroCosto: '',
  centrosCosto: [],
  destino: ''
}

const estadoAppSlice = createSlice({
  name: 'estadoApp',
  initialState,
  reducers: {
      companyAdded(state, action) {
        state.company = action.payload
      },
      mailAdded(state, action) {
        state.mail = action.payload
      },
      materialAdded(state, action) {
        state.materiales.push(action.payload)
      },
      materialDeleted(state, action) {   
        state.materiales = state.materiales.filter(material => material.id !== action.payload.materialId)        
      },
      materialUpdated(state, action) {
        const { id,  cant, comentario, destino, itemData} = action.payload
        const materialExistente = state.materiales.find(material => material.id === id)
        if (materialExistente) {          
          materialExistente.cant = cant          
          materialExistente.destino = destino
          materialExistente.comentario = comentario
          materialExistente.itemData = itemData
        }
      },
      materialClean(state) {
        state.materiales = [];
      },
      itemsAdded(state, action) {
        state.items.push(action.payload)
      },
      itemsClean(state) {
        state.items = []
      },
      tokenSave(state, action) {
        state.token = action.payload
      },
      filtroAdded(state, action) {
        state.filtro = action.payload
      },
      filtroClean(state) {
        state.filtro = ''
      },      
      buscadorAdded(state, action) {
        state.buscador = action.payload
      },
      buscadorClean(state) {
        state.buscador = ''
      },
      filtroSubCodeAdded(state, action) {                
        state.filtroSubCode = action.payload
      },
      filtroSubCodeClean(state) {                
        state.filtroSubCode = ''
      },
      filtroPadreCodeAdded(state, action) {                
        state.filtroPadreCode = action.payload
      },
      filtroPadreCodeClean(state) {                
        state.filtroPadreCode = ''
      },
      dimension4Added(state, action) {
        state.dimension4 = action.payload
      },
      dimension4Clean(state) {
        state.dimension4 = ''
      },
      userCodeAdded(state, action) {
        state.userCode = action.payload
      },
      centroCostoAdded(state, action) {
        state.centroCosto = action.payload
      },
      centroCostosAdded(state, action) {
        state.centrosCosto = action.payload
      },
      destinoAdded(state, action) {
        state.destino = action.payload
      }
  }
})

export const { mailAdded, companyAdded, dimension4Clean, materialClean, destinoAdded, centroCostoAdded, centroCostosAdded, userCodeAdded, filtroPadreCodeAdded, filtroPadreCodeClean, filtroSubCodeAdded, filtroSubCodeClean, materialAdded, materialDeleted, materialUpdated, tokenSave, filtroAdded, filtroClean, itemsAdded, itemsClean, buscadorAdded, buscadorClean, dimension4Added } = estadoAppSlice.actions

export default estadoAppSlice.reducer
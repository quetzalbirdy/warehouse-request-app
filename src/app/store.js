import { configureStore } from '@reduxjs/toolkit'

import estadoAppReducer from '../features/estadoApp/estadoAppSlice'

export default configureStore({
  reducer: {
    estadoApp: estadoAppReducer
  }
})
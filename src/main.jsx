import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/js/bootstrap.bundle.min';
import "bootstrap/dist/css/bootstrap.min.css";
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
import { store } from './redux/store.js'; 
// import {  persistor } from './redux/store.js'; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}>   */}
        <App />
      {/* </PersistGate> */}
    </Provider> 
  </StrictMode>,
)


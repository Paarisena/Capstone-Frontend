import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { ProductProvider } from './ProductProvider.jsx';


// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )
ReactDOM.createRoot(document.getElementById('root')).render(
  <ProductProvider>
  <BrowserRouter>
  <React.StrictMode>
    
      <App />
    
  </React.StrictMode>
  </BrowserRouter>
  </ProductProvider>
);
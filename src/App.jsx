import React from 'react'
import Registration from './Component/Registration';
import Login from './Component/login';

import {BrowserRouter, Routes, Route,Navigate} from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css"

// const ProtectedRoute = ({ element }) => {
//   const isLoggedIn = Boolean(localStorage.getItem("token"));

//   if (isLoggedIn) {
//     return element;
//   }
//   return <Navigate to="/Login" />;


function App() {
  
  return (
    <div>
    <BrowserRouter>
    <Routes>
    
      <Route path='/Register' element={<Registration/>}/>
      <Route path='/Login' element={<Login/>}/>
      </Routes>
      </BrowserRouter>
      </div>
    
  )

}

export default App

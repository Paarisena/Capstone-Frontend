import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ()=>{
    const isLoggedIn = localStorage.getItem('userID') && localStorage.getItem('userRole') === 'admin';
    if(!isLoggedIn){
        return <Navigate to="/AdLogin"/>
    }
    return <Outlet/>
}

export default ProtectedRoute
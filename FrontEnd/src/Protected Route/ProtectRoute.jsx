import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ()=>{
    const isLoggedIn = Boolean(localStorage.getItem('admintoken'))
    console.log("Is Logged In:", isLoggedIn)
    if(!isLoggedIn){
        return <Navigate to="/AdLogin"/>
    }
 
    console.log("Rendering Outlet");
    return <Outlet/>
}

export default ProtectedRoute
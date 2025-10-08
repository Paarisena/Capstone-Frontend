import React from 'react'
import Registration from './Component/Registration';
import Login from './Component/login';
import {BrowserRouter, Routes, Route,Navigate, useLocation, useNavigate} from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css"
import AdminRegistration from './Component/AdminRegistration';
import AddProd from './Component/Dashboard';
import ProtectedRoute from './Protected Route/ProtectRoute';
import AdLogin from '../src/Component/AdminLogin'
import ProductList from './Component/ProductListAdmin';
import AdminLayout from '../Layout/AdminLayout';
import Home from './Component/HomePage';
import Collections from './Pages/Collections';
import NavigationBar from '../NavBar/Nav';
import About from './Pages/About';
import WabiSabi from './Pages/WabiSabi';
import Abstract from './Pages/Abstract';
import Minimalist from './Pages/Minimalist';
import { ProductProvider } from './ProductProvider';
import InnerView from './Pages/Products';
import { autoLogout } from './Constant';
import { ToastContainer } from 'react-toastify';
import Cart from './Pages/Cart';

export const Currency = "₹";

function App() {
  autoLogout();
  const navigate = useNavigate();

  const handleLogin = () => {
    const Loggedin = Boolean(localStorage.getItem("Usertoken"));
    if (Loggedin) {
        localStorage.removeItem("Usertoken"); // Log out the user
        navigate("/login"); // Refresh the page
    } else {
        window.location.href = "/Login"; // Redirect to login page
    }
};



const location = useLocation(); 
const hideNavBar = location.pathname.startsWith("/admin") || location.pathname === "/AdLogin" || location.pathname === "/Register" || location.pathname === "/Admin";
  return (
    <div>
      <ToastContainer />
      
      {!hideNavBar && (
     <div className="title-section text-center py-3">
                <h1 style={{position:"relative", left:"200px"}}>ART VISTA GALLERY</h1>
                <button className="btn btn-outline-primary" onClick={handleLogin}
                style={{position:"absolute",top:"40px",right:"2rem", transform:"translateY(-50%)"}}>
                    {localStorage.getItem("Usertoken") ? "Logout" : "Login"}
                </button>
            </div>
      )}
{!hideNavBar && <NavigationBar/>}
<ProductProvider>
    <Routes>
    <Route element={<ProtectedRoute />}>
    <Route
              path="/admin/*"
              element={
                <AdminLayout>
                  <Routes>
                    <Route path="add" element={<AddProd />} />
                    <Route path="list" element={<ProductList />} />
                  </Routes>
                </AdminLayout>
              }
            />
          </Route>
      <Route path ="/Admin" element={<AdminRegistration/>}/>
      <Route path='/Register' element={<Registration/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path="/AdLogin" element={<AdLogin/>}/>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/collections" element={<Collections />} />
      <Route path="/collections/wabi-sabi" element={<WabiSabi />} />
      <Route path="/collections/abstract" element={<Abstract />} />
      <Route path="/collections/minimalist" element={<Minimalist />} />
      <Route path="/products/:id" element={<InnerView />} />
      <Route path="/cart/:id" element={<Cart />} />

      </Routes>
      </ProductProvider>
      </div>
    
  )

}

export default App

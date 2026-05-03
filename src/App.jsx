import React from 'react'
import Registration from './Component/Registration';
import Login from './Component/login';
import {BrowserRouter, Routes, Route, useLocation, useNavigate} from "react-router-dom"
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
import About from './Pages/About';
import WabiSabi from './Pages/WabiSabi';
import Abstract from './Pages/Abstract';
import Minimalist from './Pages/Minimalist'
import InnerView from './Pages/Products';
import { autoLogout } from './Constant';
import { ToastContainer } from 'react-toastify';
import Cart from './Pages/Cart';
import Profile from './Pages/Profile';
import Contact from './Component/Contact';
import ShippingPolicy from './Component/ShippingPolicy';
import ReturnPolicy from './Component/ReturnPolicy';
import Faq from './Component/Faq';
import Layout from '../Layout/Layout';
import ForgotPassword from './Component/ForgotPassword';
import ResetPassword from './Component/ResetPassword.jsx';
import Verification from './Component/Verification.jsx';
import Payment from './Pages/Payment.jsx';
import OrderSuccess from './Pages/orderSucess.jsx';
import ViewOrder from './Pages/ViewOrder.jsx';
import OrderDetails from './Pages/OrderDetails.jsx';
import Reorder from './Pages/Reorder.jsx';
import ComplianceDashboard from './Component/ComplianceDashboard.jsx';

export const Currency = "$";

function App() {
  const Username = localStorage.getItem("Username");
  autoLogout();
  const navigate = useNavigate();
  const location = useLocation(); 
  const hideNavBar = location.pathname.startsWith("/admin") || location.pathname === "/AdLogin" || location.pathname === "/Register" || location.pathname === "/Admin";

  const handleLogin = async () => {
    const Loggedin = Boolean(localStorage.getItem("userID"));
    if (Loggedin) {
        await fetch(`${import.meta.env.VITE_BE_URL}/api/logout`, { method: 'POST', credentials: 'include' });
        ["userID", "Useremail", "Username", "userRole"].forEach(k => localStorage.removeItem(k));
        window.dispatchEvent(new Event('auth-change'));
        navigate("/login");
    } else {
        window.location.href = "/Login";
    }
};
const Loggedin = Boolean(localStorage.getItem("userID"));


  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        style={{ zIndex: 99999 }}
      />
      

      
      
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route
              path="/admin/*"
              element={
                <AdminLayout>
                  <Routes>
                    <Route path="add" element={<AddProd />} />
                    <Route path="list" element={<ProductList />} />
                    <Route path="compliance" element={<ComplianceDashboard />} />
                  </Routes>
                </AdminLayout>
              }
            />
          </Route>
          
          <Route path="/Admin" element={<AdminRegistration/>}/>
          <Route path='/Register' element={<Registration/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path="/AdLogin" element={<AdLogin/>}/>
          
          {/* Layout already contains NavigationBar */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/collections/wabi-sabi" element={<WabiSabi />} />
            <Route path="/collections/abstract" element={<Abstract />} />
            <Route path="/collections/minimalist" element={<Minimalist />} />
            <Route path="/products/:id" element={<InnerView />} />
            <Route path="/cart/:id" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/view-order" element={<ViewOrder />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/return-policy" element={<ReturnPolicy />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/forgot-password" element={<ForgotPassword isAdmin={false} />} />
            <Route path="/Ad-Forgot-Password" element={<ForgotPassword isAdmin={true} />} />
            <Route path="/reset-password/:token" element={<ResetPassword isAdmin={false} />} />
            <Route path="/admin-reset-password/:token" element={<ResetPassword isAdmin={true} />} />
            <Route path="/verification/:token" element={<Verification isAdmin={false} />} />
            <Route path="/admin-verification/:token" element={<Verification isAdmin={true} />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment-success" element={<OrderSuccess />} />
            <Route path="/payment-success/:orderId" element={<OrderSuccess />} />
            <Route path="/order-details/:orderId" element={<OrderDetails />} />
            <Route path="/reorder/:orderId" element={<Reorder />} />

          </Route>
        </Routes>
      
    </div>
  );
}

export default App;

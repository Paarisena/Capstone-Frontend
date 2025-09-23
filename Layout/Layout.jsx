import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from '../NavBar/Nav'; // Adjust path if needed
import Footer from '../src/Component/Footer'; // Adjust path if needed

const Layout = () => {
  return (
    <div className="site-wrapper">
      <NavigationBar />
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
      
      <style jsx>{`
        .site-wrapper {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        
        .main-content-wrapper {
          flex: 1;
          padding-bottom: 6rem; /* Important: Creates space for footer */
        }
      `}</style>
    </div>
  );
};

export default Layout;
import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Button, Nav } from "react-bootstrap";
import { 
  PlusCircleFill, 
  ListUl, 
  BoxArrowRight, 
  ChevronLeft, 
  ChevronRight,
  Palette
} from "react-bootstrap-icons";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  
  const handlelogout = async () => {
    try {
      localStorage.removeItem("admintoken");
      navigate('/AdLogin');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          {!collapsed && <span className="logo-text">Art Vista</span>}
          {collapsed && <Palette size={24} />}
        </div>
        <Button 
          variant="link" 
          className="collapse-btn"
          onClick={toggleSidebar}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>
      
      <Nav className="flex-column sidebar-nav">
        <NavLink to="add" className={({ isActive }) => 
          `sidebar-link ${isActive ? "active-link" : ""}`
        }>
          <div className="link-icon">
            <PlusCircleFill size={18} />
          </div>
          {!collapsed && <span className="link-text">Add Product</span>}
        </NavLink>
        
        <NavLink to="list" className={({ isActive }) => 
          `sidebar-link ${isActive ? "active-link" : ""}`
        }>
          <div className="link-icon">
            <ListUl size={18} />
          </div>
          {!collapsed && <span className="link-text">Product List</span>}
        </NavLink>
      </Nav>
      
      <div className="sidebar-footer">
        <Button 
          variant="outline-danger" 
          className="logout-btn" 
          onClick={handlelogout}
        >
          <div className="link-icon">
            <BoxArrowRight size={18} />
          </div>
          {!collapsed && <span className="link-text">Logout</span>}
        </Button>
      </div>
      
      <style jsx>{`
        .sidebar {
          height: 100vh;
          width: 250px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          transition: width 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 1000;
          border-right: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .sidebar.collapsed {
          width: 70px;
        }
        
        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.1);
        }
        
        .logo-container {
          display: flex;
          align-items: center;
          font-weight: bold;
          color: #6e8efb;
          font-size: 1.25rem;
          overflow: hidden;
        }
        
        .collapse-btn {
          padding: 0;
          color: #6e8efb;
          background: transparent;
          border: none;
        }
        
        .sidebar-nav {
          flex-grow: 1;
          margin-top: 20px;
          overflow-y: auto;
          padding: 0 15px;
        }
        
        .sidebar-link {
          display: flex;
          align-items: center;
          padding: 12px 10px;
          color: #495057;
          text-decoration: none;
          border-radius: 6px;
          margin-bottom: 8px;
          transition: all 0.2s;
          white-space: nowrap;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(5px);
        }
        
        .sidebar-link:hover {
          background: rgba(110, 142, 251, 0.1);
          color: #6e8efb;
        }
        
        .active-link {
          background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
          color: white;
        }
        
        .active-link:hover {
          color: white;
        }
        
        .link-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          margin-right: 10px;
          flex-shrink: 0;
        }
        
        .link-text {
          opacity: 1;
          transition: opacity 0.2s;
        }
        
        .sidebar-footer {
          margin-top: auto;
          padding: 15px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.1);
        }
        
        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          background: rgba(220, 53, 69, 0.1);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(220, 53, 69, 0.2);
          color: #dc3545;
        }
        
        .logout-btn:hover {
          background: rgba(220, 53, 69, 0.2);
          border-color: rgba(220, 53, 69, 0.3);
          color: #dc3545;
        }
        
        /* Scrollbar styling */
        .sidebar-nav::-webkit-scrollbar {
          width: 6px;
        }
        
        .sidebar-nav::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .sidebar-nav::-webkit-scrollbar-thumb {
          background: rgba(110, 142, 251, 0.3);
          border-radius: 3px;
        }
        
        /* Responsive adjustments */
        @media (max-width: 992px) {
          .sidebar {
            width: 70px;
          }
          
          .sidebar .link-text, 
          .sidebar .logo-text {
            display: none;
          }
          
          .sidebar.collapsed {
            width: 250px;
          }
          
          .sidebar.collapsed .link-text,
          .sidebar.collapsed .logo-text {
            display: inline;
          }
          
          .sidebar .link-icon {
            margin-right: 0;
          }
          
          .sidebar.collapsed .link-icon {
            margin-right: 10px;
          }
        }
        
        @media (max-width: 576px) {
          .sidebar {
            width: 0;
            box-shadow: none;
          }
          
          .sidebar.collapsed {
            width: 250px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
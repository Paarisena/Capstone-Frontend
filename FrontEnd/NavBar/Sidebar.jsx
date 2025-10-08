import React from "react";
import { useNavigate,NavLink } from "react-router-dom";
import { Button, Nav } from "react-bootstrap";
import "./sidebar.css";

const Sidebar = () =>{

     const navigate = useNavigate()
    
     const handlelogout = async () => {
        try {
          localStorage.removeItem("admintoken");
          navigate('/AdLogin');
        } catch (error) {
          console.error("Error during logout:", error);
        }
      };
    return(
        <div className="sidebar">
            <Nav className="flex-column">
                <NavLink to="add" className={({ isActive }) => (isActive ? "active-link" : "")}>Add Product</NavLink>
                <NavLink to="list" className={({ isActive }) => (isActive ? "active-link" : "")}>Product List</NavLink>
                <Button variant="primary" type="submit" onClick={handlelogout}>Logout</Button>
            </Nav>
        </div>
    )
}

export default Sidebar;
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Dropdown, Badge } from "react-bootstrap";
import "./Navbar.css";

const NavigationBar = () => {
  const [expanded, setExpanded] = useState(false);
  const cartCount = Number(localStorage.getItem("cartCount")) || 0;
  const navigate = useNavigate();
  const Username = localStorage.getItem("Username");
  const Loggedin = Boolean(localStorage.getItem("Usertoken"));

  const handleNavLinkClick = () => {
    setExpanded(false);
  };

  const handleLogin = () => {
    if (Loggedin) {
      localStorage.removeItem("Usertoken");
      window.location.href = "/";
    } else {
      window.location.href = "/Login";
    }
  };

  return (
    <Navbar 
      expanded={expanded} 
      className="navbar-glass sticky-top"
    >
      <Container fluid>
        <Navbar.Brand 
          className="navbar-brand mx-auto mx-lg-0"
          onClick={() => navigate("/")}
        >
          ART VISTA GALLERY
        </Navbar.Brand>
        
        <div className="d-flex order-lg-last">
          {!Loggedin ? (
            <button 
              className="btn btn-outline-primary me-2" 
              onClick={handleLogin}
            >
              Login
            </button>
          ) : (
            <Dropdown align="end">
              <Dropdown.Toggle variant="link" id="dropdown-username" className="nav-user-menu">
                Welcome, {Username}
                {cartCount > 0 && (
                  <Badge bg="danger" pill className="ms-2">
                    {cartCount}
                  </Badge>
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => navigate("/cart/" + localStorage.getItem("userID"))}>
                  My Cart
                  {cartCount > 0 && (
                    <Badge bg="danger" pill className="ms-2">
                      {cartCount}
                    </Badge>
                  )}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => navigate("/profile")}>
                  Profile
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogin}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
          
          <Navbar.Toggle 
            aria-controls="basic-navbar-nav" 
            onClick={() => setExpanded(!expanded)}
            className="ms-2"
          />
        </div>
        
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav className="nav-links">
            <NavLink to="/collections" className="nav-link px-3" onClick={handleNavLinkClick}>
              All Painting
            </NavLink>
            <NavLink to="/about" className="nav-link px-3" onClick={handleNavLinkClick}>
              About
            </NavLink>
            <NavLink to="/collections/wabi-sabi" className="nav-link px-3" onClick={handleNavLinkClick}>
              Wabi Sabi Wall Art
            </NavLink>
            <NavLink to="/collections/abstract" className="nav-link px-3" onClick={handleNavLinkClick}>
              Abstract Wall Art
            </NavLink>
            <NavLink to="/collections/minimalist" className="nav-link px-3" onClick={handleNavLinkClick}>
              Minimalist Wall Art
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
      
      <style jsx>{`
        .navbar-glass {
          background: rgba(217, 216, 221, 0.7) !important;
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          width: 101%;
        }

        .navbar-brand {
          font-weight: 600;
          font-size: 1.5rem;
          cursor: pointer;
          color: #333;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .nav-links {
          text-align: center;
        }
        
        .nav-link {
          color: #333;
          font-weight: 500;
          transition: all 0.3s ease;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
        }
        
        .nav-link:hover, .nav-link.active {
          color: #007bff !important;
          background: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(5px);
        }

        .btn-outline-primary {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(0, 123, 255, 0.3);
          transition: all 0.3s ease;
        }

        .btn-outline-primary:hover {
          background: rgba(0, 123, 255, 0.1);
          border-color: rgba(0, 123, 255, 0.5);
        }
        
        .nav-user-menu {
          color: #333;
          text-decoration: none;
          padding: 0.5rem 1rem;
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(5px);
          border-radius: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .dropdown-menu {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .dropdown-item {
          transition: all 0.3s ease;
        }

        .dropdown-item:hover {
          background: rgba(0, 123, 255, 0.1);
        }

        .badge {
          backdrop-filter: blur(5px);
        }
        
        @media (max-width: 991px) {
          .navbar-brand {
            font-size: 1.25rem;
            margin-bottom: 0;
          }
          
          .nav-links {
            margin-top: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            background: rgba(255, 255, 255, 0.1);
            padding: 1rem;
            border-radius: 0.5rem;
          }
          
          .nav-link {
            padding: 0.5rem 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .nav-link:last-child {
            border-bottom: none;
          }

          .navbar-toggler {
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
        }
      `}</style>
    </Navbar>
  );
};

export default NavigationBar;
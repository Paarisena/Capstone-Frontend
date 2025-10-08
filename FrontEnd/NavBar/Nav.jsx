import React, {useState} from "react";
import { NavLink} from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import "./Navbar.css"; // Import your CSS file for custom styles

const NavigationBar = () => {
    const [expanded, setExpanded] = useState(false); // State to control navbar collapse

    const handleNavLinkClick = () => {
        setExpanded(false); // Collapse the navbar when a link is clicked
    }
    return (
        <Navbar bg="light" className="fixed-navbar"  > 
            <Container className="text-center">
                {/* Navigation Links */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="d-flex flex-row align-items-center">
                    <Nav className="d-flex flex-row justify-content-center gap-4 w-100">
                        <NavLink to="/collections" className="nav-link" onClick={handleNavLinkClick}>
                            All Painting
                        </NavLink>
                        <NavLink to="/about" className="nav-link" onClick={handleNavLinkClick}>
                            About
                        </NavLink>
                        <NavLink to="/collections/wabi-sabi" className="nav-link" onClick={handleNavLinkClick}>
                            Wabi Sabi Wall Art
                        </NavLink>
                        <NavLink to="/collections/abstract" className="nav-link" onClick={handleNavLinkClick}>
                            Abstract Wall Art  
                        </NavLink>
                        <NavLink to="/collections/minimalist" className="nav-link" onClick={handleNavLinkClick}>
                            Minimalist Wall Art
                        </NavLink>     
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
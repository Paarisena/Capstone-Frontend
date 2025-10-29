import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin } from "react-bootstrap-icons";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer bg-dark text-light">
      <Container>
        <Row className="py-4">
          <Col lg={4} md={6} className="mb-4 mb-lg-0">
            <h5 className="text-uppercase mb-3 footer-heading">Art Vista Gallery</h5>
            <p className="mb-3">
              Discover exceptional wall art that transforms spaces and inspires moments of reflection.
            </p>
            <div className="d-flex social-links">
              <a href="https://facebook.com" className="me-3" target="_blank" rel="noopener noreferrer">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" className="me-3" target="_blank" rel="noopener noreferrer">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" className="me-3" target="_blank" rel="noopener noreferrer">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Linkedin size={20} />
              </a>
            </div>
          </Col>
          
          <Col lg={2} md={6} className="mb-4 mb-lg-0">
            <h6 className="text-uppercase mb-3 footer-heading">Collections</h6>
            <ul className="list-unstyled footer-links">
              <li className="mb-2">
                <Link to="/wabisabi" className="text-decoration-none">Wabi-Sabi</Link>
              </li>
              <li className="mb-2">
                <Link to="/abstract" className="text-decoration-none">Abstract</Link>
              </li>
              <li className="mb-2">
                <Link to="/minimalist" className="text-decoration-none">Minimalist</Link>
              </li>
              <li>
                <Link to="/collections" className="text-decoration-none">All Collections</Link>
              </li>
            </ul>
          </Col>
          
          <Col lg={3} md={6} className="mb-4 mb-lg-0">
            <h6 className="text-uppercase mb-3 footer-heading">Customer Service</h6>
            <ul className="list-unstyled footer-links">
              <li className="mb-2">
                <Link to="/faq" className="text-decoration-none">FAQs</Link>
              </li>
              <li className="mb-2">
                <Link to="/shipping-policy" className="text-decoration-none">Shipping Policy</Link>
              </li>
              <li className="mb-2">
                <Link to="/return-policy" className="text-decoration-none">Return & Refund Policy</Link>
              </li>
              <li>
                <Link to="/contact" className="text-decoration-none">Contact Us</Link>
              </li>
            </ul>
          </Col>
          
          <Col lg={3} md={6} className="mb-4 mb-lg-0">
            <h6 className="text-uppercase mb-3 footer-heading">Legal</h6>
            <ul className="list-unstyled footer-links">
              <li className="mb-2">
                <Link to="/privacy-policy" className="text-decoration-none">Privacy Policy</Link>
              </li>
              <li className="mb-2">
                <Link to="/terms-of-service" className="text-decoration-none">Terms of Service</Link>
              </li>
              <li>
                <Link to="/about" className="text-decoration-none">About Us</Link>
              </li>
            </ul>
          </Col>
        </Row>
        
        <hr className="footer-divider" />
        
        <Row className="py-3">
          <Col>
            <p className="text-center mb-0 small">
              © {currentYear} Art Vista Gallery. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
      
      <style jsx>{`
        .footer {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: 6rem; /* Significantly increased margin to avoid overlap */
          position: relative;
          width: 105%;
          clear: both; /* Ensures the footer clears any floating elements */
        }
        
        .footer-heading {
          position: relative;
          font-weight: 600;
        }
        
        .footer-heading::after {
          content: '';
          display: block;
          width: 40px;
          height: 2px;
          background-color: #007bff;
          margin-top: 10px;
        }
        
        .footer-links li a {
          color: rgba(255, 255, 255, 0.75);
          transition: color 0.2s ease;
        }
        
        .footer-links li a:hover {
          color: #007bff;
        }
        
        .social-links a {
          color: rgba(255, 255, 255, 0.75);
          transition: color 0.2s ease;
        }
        
        .social-links a:hover {
          color: #007bff;
        }
        
        .footer-divider {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: 0;
          margin-bottom: 0;
        }
        
        @media (max-width: 767px) {
          .footer-heading {
            font-size: 1.1rem;
          }
          
          .footer {
            margin-top: 4rem; /* Increased margin on mobile but still substantial */
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
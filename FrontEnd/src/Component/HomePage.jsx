import React from 'react';
import Collections from '../Pages/Collections';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Hero from './Hero';
import NavigationBar from '../../NavBar/Nav';
import { useLocation } from 'react-router-dom';

const Home = () => { 
  return ( 
    <>
      <Container fluid className="home-container">
        <Row className="g-0">
          <Col>
            <Hero />
            <Collections />
          </Col>
        </Row>

        <style jsx>{`
          .home-container {
            position: relative;
            width: 101.5%;
            left: -0.75rem;
            height: auto;
            min-height: 100vh;
            overflow: hidden;
          }

          .home-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            backdrop-filter: blur(10px);
            z-index: 0;
          }

          :global(.hero-content) {
            position: relative;
            z-index: 1;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 1rem;
            margin: 1rem;
          }

          :global(.row) {
            margin: 0;
            width: 100%;
          }

          @media (max-width: 768px) {
            .home-container {
              padding: 0;
            }
            
            :global(.hero-content) {
              margin: 0.5rem;
            }
          }
        `}</style>
      </Container>
    </>
  );
}

export default Home;
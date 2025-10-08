import React from 'react';
import Collections from '../Pages/Collections';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Hero from './Hero';
import NavigationBar from '../../NavBar/Nav';
import { useLocation } from 'react-router-dom';



const Home = () => { 
     

  return ( 
        <>
            
        <Container fluid className="vh-100 d-flex flex-column">
        
               <Hero />
 
        </Container>
        </>
    );
}

export default Home;
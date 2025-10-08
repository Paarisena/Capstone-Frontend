import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import {assets} from '../assets/assets'

const Hero = () => {
  return (
    <Container fluid className="border border-gray-400">
      <Row className="justify-content-center">
        <Col sm={12} md={6} className="p-0">
          <img className="img-fluid w-100" src={assets.home_Img} alt="Hero" />
        </Col>
      </Row>
    </Container>
  );
};

export default Hero;
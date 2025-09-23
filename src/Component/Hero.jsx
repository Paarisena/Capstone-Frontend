import React from 'react';
import { Container, Carousel, Button } from 'react-bootstrap';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <Container fluid className="p-0 hero-container">
      <Carousel fade interval={5000} className="responsive-carousel">
        <Carousel.Item>
          <div className="carousel-image-container">
            <img
              src={assets.home_Img}
              alt="First slide"
              className="d-block w-100 carousel-image"
              onClick={() => navigate("/collections")}
            />
          </div>
          <Carousel.Caption className="carousel-text-container">
            <div className="caption-content">
              <h3 className="carousel-title">Welcome to Art Vista Gallery</h3>
              <p className="carousel-description">Discover the best products at unbeatable prices!</p>
              <Button 
                variant="outline-light" 
                className="shop-now-button"
                onClick={() => navigate("/collections")}
              >
                Shop Now
              </Button>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <div className="carousel-image-container">
            <img
              src={assets.home_Img2}
              alt="Second slide"
              className="d-block w-100 carousel-image"
              onClick={() => navigate("/collections")}
            />
          </div>
          <Carousel.Caption className="carousel-text-container">
            <div className="caption-content">
              <h3 className="carousel-title">Explore Our Collection</h3>
              <p className="carousel-description">Find unique art pieces and support local artists.</p>
              <Button 
                variant="outline-light" 
                className="shop-now-button"
                onClick={() => navigate("/collections/abstract")}
              >
                View Abstract Art
              </Button>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      
      <style jsx>{`
        .hero-container {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        
        .carousel-image-container {
          width: 100%;
          height: 100%;
        }
        
        .carousel-image {
          height: 110vh;
          object-fit: cover;
          width: 100%;
        }
        
        .carousel-text-container {
          padding: 20px;
          max-width: 80%;
          margin: 0 auto;
          left: 10%;
          right: 10%;
          bottom: 20%;
          /* Text shadow to make text readable on any background */
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        }
        
        .carousel-title {
          color: #fff;
          font-weight: bold;
          font-size: 2.5rem;
        }
        
        .carousel-description {
          color: #fff;
          font-size: 1.3rem;
        }
        
        .shop-now-button {
          margin-top: 15px;
          font-weight: 600;
          padding: 8px 20px;
          border-radius: 5px;
          /* Add a slight shadow to the button for better visibility */
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }
        
        /* Responsive Styles */
        @media (max-width: 1200px) {
          .carousel-title {
            font-size: 2rem;
          }
          .carousel-description {
            font-size: 1.1rem;
          }
        }
        
        @media (max-width: 992px) {
          .carousel-image {
            height: 70vh;
          }
          .carousel-text-container {
            bottom: 15%;
          }
          .carousel-title {
            font-size: 1.8rem;
          }
          .carousel-description {
            font-size: 1rem;
          }
        }
        
        @media (max-width: 768px) {
          .carousel-image {
            height: 60vh;
          }
          .carousel-text-container {
            bottom: 10%;
            padding: 15px;
          }
          .carousel-title {
            font-size: 1.5rem;
          }
          .carousel-description {
            font-size: 0.9rem;
          }
          .shop-now-button {
            padding: 5px 15px;
            font-size: 0.9rem;
          }
        }
        
        @media (max-width: 576px) {
          .carousel-image {
            height: 50vh;
          }
          .carousel-text-container {
            max-width: 90%;
            padding: 10px;
            bottom: 10%;
          }
          .carousel-title {
            font-size: 1.2rem;
          }
          .carousel-description {
            font-size: 0.8rem;
            margin-bottom: 5px;
          }
          .shop-now-button {
            padding: 3px 10px;
            font-size: 0.8rem;
            margin-top: 8px;
          }
        }
      `}</style>
    </Container>
  );
};

export default Hero;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProductsPublic } from "../Constant";
import { Card, Row, Col, Spinner, Alert, Container } from "react-bootstrap";
import { Currency } from "../App";
import "../Pages/Collect.css";

const Abstract = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAbstractProducts = async () => {
      try {
        setLoading(true);
        const response = await fetchProductsPublic();
        
        if (!response || !response.products) {
          throw new Error("Invalid response format");
        }
        
        const filteredProducts = response.products.filter(
          (product) => product.Category === "2"
        );
        
        setProducts(filteredProducts);
        setError(null);
      } catch (error) {
        console.error("Error fetching abstract products:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAbstractProducts();
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="collections-wrapper py-4 px-3 px-md-4">
      <Container fluid className="px-0">
        <div className="collection-header d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <div>
            <h2 className="collection-title mb-2">Abstract Wall Art</h2>
            <p className="collection-description text-muted">
              Explore the world of emotions and imagination through our curated Abstract art collection.
            </p>
          </div>
          
          <div className="d-flex align-items-center mt-3 mt-md-0">
            <div className="items-info text-muted">
              {products.length} items
            </div>
          </div>
        </div>
      
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}
        
        {!loading && products.length === 0 && !error && (
          <div className="text-center py-5">
            <p className="fs-4">No Abstract art products available.</p>
          </div>
        )}
        
        {products.length > 0 && (
          <Row className="g-4 justify-content-center">
            {products.map((product, index) => (
              <Col 
                key={product._id || `product-${index}`} 
                xxl={3} 
                xl={4} 
                lg={4} 
                md={6} 
                sm={6} 
                xs={12}
                className="product-col"
              >
                <Card 
                  className="h-100 product-card" 
                  onClick={() => handleProductClick(product._id)}
                >
                  <div className="card-img-wrapper">
                    <Card.Img
                      variant="top"
                      src={product.Image?.[0] || "placeholder.jpg"}
                      alt={product.productName || "Abstract Art"}
                      className="product-image"
                    />
                  </div>
                  <Card.Body className="d-flex flex-column p-3">
                    <Card.Title className="product-title mb-auto">
                      {product.productName}
                    </Card.Title>
                    <Card.Text className="product-price mt-2">
                      {Currency}{product.Price}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      <style jsx>{`
        .collections-wrapper {
          max-width: 1600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding-bottom: 6rem; /* Ensure space for footer */
          min-height: 70vh;
        }
        
        .collection-title {
          font-weight: 600;
          color: #333;
          position: relative;
          margin: 0;
          font-size: 1.75rem;
        }
        
        .collection-description {
          margin-bottom: 0;
          max-width: 800px;
        }
        
        .collection-header {
          margin-bottom: 1.5rem;
          border-bottom: 1px solid #eaeaea;
          padding-bottom: 1rem;
        }
        
        .items-info {
          font-size: 0.9rem;
          white-space: nowrap;
        }
        
        /* Product cards - matching WabiSabi/Minimalist style */
        .product-col {
          padding: 0 15px;
        }
        
        .product-card {
          transition: transform 0.3s, box-shadow 0.3s;
          cursor: pointer;
          border: none;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          max-width: 320px;
          margin: 0 auto;
        }
        
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px rgba(0,0,0,0.1);
        }
        
        .card-img-wrapper {
          overflow: hidden;
          position: relative;
          padding-top: 80%;
        }
        
        .product-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }
        
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
        
        .product-title {
          font-size: 1.1rem;
          font-weight: 500;
          margin-bottom: 8px;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 1.4;
        }
        
        .product-price {
          font-weight: 600;
          color: #007bff;
          margin-bottom: 0;
          font-size: 1.15rem;
        }
        
        @media (max-width: 991px) {
          .collection-title {
            font-size: 1.6rem;
          }
        }
        
        @media (max-width: 767px) {
          .collection-title {
            font-size: 1.5rem;
          }
          
          .product-title {
            font-size: 1rem;
          }
          
          .product-price {
            font-size: 1.1rem;
          }
          
          .collection-header {
            text-align: center;
          }
        }
        
        @media (max-width: 576px) {
          .collection-title {
            font-size: 1.4rem;
          }
          
          .product-price {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Abstract;
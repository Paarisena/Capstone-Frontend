import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProductsPublic } from "../Constant";
import { Card, Row, Col, Spinner, Alert, Container } from "react-bootstrap";
import { Currency } from "../App";
import "../Pages/Collect.css";
import { FaSearch } from 'react-icons/fa';

const WabiSabi = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    

  useEffect(() => {
    const fetchWabiSabiProducts = async () => {
      try {
        setLoading(true);
        const response = await fetchProductsPublic();
        
        if (!response || !response.products) {
          throw new Error("Invalid response format");
        }
        
        const filteredProducts = response.products.filter(
          (product) => product.Category === "1"
        );
        
        setProducts(filteredProducts);
        setError(null);
      } catch (error) {
        console.error("Error fetching Wabi-Sabi products:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchWabiSabiProducts();
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

   const filterProducts = (products) => {
        if (!searchTerm.trim()) return products;
        return products.filter(product => 
            product.productName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };
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
                <h2 className="collection-title mb-2">Wabi Sabi Wall Art</h2>
                <p className="collection-description text-muted">
                    Embrace the beauty of imperfection with our Wabi Sabi inspired artwork collection.
                </p>
            </div>
            
            <div className="d-flex align-items-center mt-3 mt-md-0">
                <div className={`search-container ${showSearch ? 'active' : ''}`}>
                    <button 
                        className="search-icon-btn"
                        onClick={() => setShowSearch(!showSearch)}
                        type="button"
                    >
                        <FaSearch />
                    </button>
                    {showSearch && (
                        <input
                            type="search"
                            placeholder="Search products..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    )}
                </div>
                <div className="items-info text-muted ms-3">
                    {filterProducts(products).length} items
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
            <p className="fs-4">No Wabi Sabi art products available.</p>
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
                      alt={product.productName || "Wabi Sabi Art"}
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
        
        /* Product cards - matching All Paintings style */
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
        
        .search-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon-btn {
          background: rgba(255, 255, 255, 0.9);
          border: none;
          color: #007bff;
          font-size: 1.2rem;
          padding: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 2;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .search-icon-btn:hover {
          background: rgba(255, 255, 255, 1);
          color: #0056b3;
          transform: translateY(-1px);
        }

        .search-input {
          position: absolute;
          right: 0;
          width: 0;
          padding: 0.5rem;
          border: none;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          opacity: 0;
        }

        .search-container.active .search-input {
          width: 250px;
          padding: 0.5rem 2.5rem 0.5rem 1rem;
          opacity: 1;
          border: 1px solid rgba(0, 123, 255, 0.2);
        }

        .search-input:focus {
          outline: none;
          border-color: rgba(0, 123, 255, 0.5);
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
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

export default WabiSabi;
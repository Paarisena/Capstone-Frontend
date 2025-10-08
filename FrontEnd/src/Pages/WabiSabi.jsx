import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProducts } from "../Constant";
import { Card, Row, Col, Container } from "react-bootstrap";
import { Currency } from "../App";
import "../Pages/Collect.css"; // Import the custom CSS for the row
import { use } from "react";

const WabiSabi = () => {
     const { category } = useParams();
     const [products, setProducts] = useState([]);
     const navigate = useNavigate();

     useEffect(() => {
      const fetchSingleCategory = async () => {
        try{
          const response = await fetchProducts();
          console.log("Products fetched:", response);
          const filteredProducts = response.products.filter(
            (product) => product.Category === "1"
          );
          console.log("Filtered Products:", filteredProducts);
          console.log("Response Products:", response.products);
          setProducts(filteredProducts);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };
      
      fetchSingleCategory();
    }, [category]);

     const handleProductClick = (productId) => {
            navigate(`/products/${productId}`);
        };

    return (
      <Container>
        <div className="wabi-sabi">
          {products.length > 0 ? (
            <Row className="custom">
              {products.map((product, index) => (
                <Col key={index} md={4} sm={6} xs={12} className="mb-4">
                  <Card style={{ width: '18rem' }} className="h-100 shadow-sm" onClick={() => handleProductClick(product._id)}>
                  {/* Card Image */}
                  <Card.Img
                    variant="top"
                    src={product.Image[0]   || "placeholder.jpg"}
                    alt={product.productName || "Product Image"}
                    style={{
                      height: "200px", // Fixed height for the image
                      width: "100%", // Full width of the card
                      objectFit: "cover", // Ensures proportional cropping
                    }}
                  />
                  {/* Card Body */}
                  <Card.Body className="d-flex flex-column justify-content-between align-items-center">
                    <Card.Title className="text-center">{product.productName}</Card.Title>
                    <Card.Text className="text-center">Price: {Currency}{product.Price}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p className="text-center">No products available in this category.</p>
        )}
      </div>
    </Container>
  );
};

export default WabiSabi;
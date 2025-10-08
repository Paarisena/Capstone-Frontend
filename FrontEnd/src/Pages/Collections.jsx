import { useEffect, useState } from "react";
import { fetchProducts } from "../Constant";
import { useNavigate } from "react-router-dom";
import { Card, Container, Row, Col } from "react-bootstrap";
import { Currency } from "../App";
import "./Collect.css"; // Import the custom CSS for the row

const Collections = () => {
    const [collections, setCollections] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchCollections = async () => {
        try {
            const response = await fetchProducts();
            console.log("Products fetched:", response);

            // Group products by category
            const groupedCollections = response.products.reduce((acc, product) => {
                const category = product.category || "1";
                if (!acc[category]) {
                    acc[category] = [];
                }
                acc[category].push(product);
                return acc;
            }, {});

            setCollections(groupedCollections);
        } catch (error) {
            console.error("Error Fetching Collections:", error);
            setError("Failed to fetch collections. Please try again later.");
        }
    }
    useEffect(() => {
        fetchCollections();
    }, []);

       const handleProductClick = (productId) => {
            navigate(`/products/${productId}`);
        };


    return (
        <Container>
            {error && <p className="text-danger">{error}</p>}
            {Object.keys(collections).length > 0 ? (
                Object.keys(collections).map((category) => (
                    <div key={category} className="md-3">
                        <Row>
                            {collections[category].map((product) => (
                                <Col key={product.id} md={3}>
                                    <Card style={{ width: '18rem', cursor: 'pointer' }} className="h-100 shadow-sm" onClick={() => handleProductClick(product._id)}>   
                                        {/* Card Image */}
                                        <Card.Img
                                            variant="top"
                                            src={product.Image[0] || "placeholder.jpg"}
                                            alt={product.productName || "Product Image"}
                                            style={{
                                                height: "200px", // Fixed height for the image
                                                width: "100%", // Full width of the card
                                                objectFit: "cover", // Ensures proportional cropping
                                            }}
                                        />
                                        {/* Card Body */}
                                        <Card.Body className="d-flex flex-column justify-content-between align-items-center">
                                            <Card.Title className="text-center">
                                                {product.productName}
                                            </Card.Title>
                                            <Card.Text className="text-center">
                                                Price: {Currency}{product.Price}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                ))
            ) : (
                <p>No collections available.</p>
            )}
        </Container>
    );
};

export default Collections;
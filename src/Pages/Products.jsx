import { useState, useEffect } from "react";
import { fetchProductsPublic } from "../Constant";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Card, Button, Carousel, Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { reviewProduct, fetchReviews, deleteReview, addProductToCart } from "../Constant";
import { StarFill, Star, CartPlus, CreditCard } from 'react-bootstrap-icons';

const InnerView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionStatus, setActionStatus] = useState({ message: '', type: '' });
    const [activeImage, setActiveImage] = useState(0);

    const Username = localStorage.getItem("Username") || "";
    const [review, setReview] = useState({ name: Username, rating: 5, comment: "" });
    const isLoggedIn = localStorage.getItem("Usertoken") ? true : false;

    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setReview((prevReview) => ({
            ...prevReview,
            [name]: value
        }));
    };

    const handleAddToCart = async () => {
        const userId = localStorage.getItem("userID");
        const token = localStorage.getItem("Usertoken");
        
        if (!isLoggedIn) {
            setActionStatus({
                message: "Please log in to add items to the cart",
                type: "danger"
            });
            return;
        }
        
        try {
            setActionStatus({ message: "Adding to cart...", type: "info" });
            const response = await addProductToCart(userId, id, token);
            
            if (response.success) {
                setActionStatus({
                    message: "Product added to cart successfully!",
                    type: "success"
                });
                
                // Clear status message after 3 seconds
                setTimeout(() => {
                    setActionStatus({ message: '', type: '' });
                }, 3000);
            } else {
                setActionStatus({
                    message: response.message || "Failed to add to cart",
                    type: "danger"
                });
            }
        } catch (error) {
            console.error("Error adding product to cart:", error);
            setActionStatus({
                message: "Something went wrong. Please try again",
                type: "danger"
            });
        }
    };

    const handleBuyNow = () => {
        if (!isLoggedIn) {
            setActionStatus({
                message: "Please log in to proceed with purchase",
                type: "danger"
            });
            return;
        }
        
        handleAddToCart();
        navigate('/cart');
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) return;

        try {
            setActionStatus({ message: "Submitting review...", type: "info" });
            const data = await reviewProduct(id, { ...review, name: Username });
            
            if (data.success) {
                setReview({ name: Username, rating: 5, comment: "" });
                const refreshed = await fetchReviews(id);
                if (refreshed.success) setReviews(refreshed.reviews);
                
                setActionStatus({
                    message: "Review submitted successfully!",
                    type: "success"
                });
                
                // Clear status after 3 seconds
                setTimeout(() => {
                    setActionStatus({ message: '', type: '' });
                }, 3000);
            } else {
                setActionStatus({
                    message: "Failed to submit review",
                    type: "danger"
                });
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            setActionStatus({
                message: "Error submitting review",
                type: "danger"
            });
        }
    };

    const handleDeleteReview = async () => {
        if (!isLoggedIn) return;

        try {
            setActionStatus({ message: "Deleting review...", type: "info" });
            const response = await deleteReview(id, Username);
            
            if (response && response.success) {
                const refreshed = await fetchReviews(id);
                if (refreshed.success) setReviews(refreshed.reviews);
                
                setActionStatus({
                    message: "Review deleted successfully!",
                    type: "success"
                });
                
                // Clear status after 3 seconds
                setTimeout(() => {
                    setActionStatus({ message: '', type: '' });
                }, 3000);
            } else {
                setActionStatus({
                    message: "Failed to delete review",
                    type: "danger"
                });
            }
        } catch (error) {
            console.error("Error deleting review:", error);
            setActionStatus({
                message: "Error deleting review",
                type: "danger"
            });
        }
    };
    
    useEffect(() => {
        const loadReviews = async () => {
            try {
                const response = await fetchReviews(id);
                if (response.success) {
                    setReviews(response.reviews);
                    setReview({ name: Username, rating: 5, comment: "" });
                } else {
                    console.error("Failed to fetch reviews:", response.message);
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        const loadProduct = async () => {
            try {
                setLoading(true);
                const response = await fetchProductsPublic();
                if (!response || !response.products) {
                    throw new Error("Invalid response format");
                }
                
                const filteredProduct = Array.isArray(response.products)
                    ? response.products.find((p) => String(p._id) === String(id))
                    : null;
                    
                if (!filteredProduct) {
                    throw new Error("Product not found");
                }
                
                setProduct(filteredProduct);
                setError(null);
            } catch (error) {
                console.error("Error fetching product:", error);
                setError(error.message || "Failed to load product");
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
        loadReviews();
    }, [id, Username]);
    
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error || !product) {
        return (
            <Container className="py-4">
                <Alert variant="danger">
                    {error || "Product not found"}
                </Alert>
                <div className="text-center mt-3">
                    <Button variant="outline-primary" onClick={() => navigate('/')}>
                        Return to Home
                    </Button>
                </div>
            </Container>
        );
    }

    const images = Array.isArray(product.Image) && product.Image.length > 0
        ? product.Image
        : [product.Images || product.image || "placeholder.jpg"];

    // Calculate average rating from reviews
    const averageRating = reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + Number(r.rating), 0) / reviews.length).toFixed(1)
        : "No ratings";

    return (
        <div className="bg-white">
            {actionStatus.message && (
                <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050, maxWidth: "300px" }}>
                    <Alert 
                        variant={actionStatus.type} 
                        className="shadow-sm py-2 px-3"
                        dismissible
                        onClose={() => setActionStatus({ message: '', type: '' })}
                    >
                        {actionStatus.message}
                    </Alert>
                </div>
            )}
            
            <Container className="py-4" style={{ position: 'relative', top: '7rem' }}>
                <Row className="mb-4">
                    {/* Product Images */}
                    <Col lg={5} md={6} className="mb-4 mb-md-0">
                        <div className="bg-light rounded p-2 text-center">
                            <img
                                src={images[activeImage] || "placeholder.jpg"}
                                alt={`${product.productName || "Product"} - Main Image`}
                                className="img-fluid"
                                style={{ maxHeight: "400px", objectFit: "contain" }}
                            />
                        </div>
                        
                        {images.length > 1 && (
                            <Row className="g-2 mt-2">
                                {images.map((img, idx) => (
                                    <Col key={idx} xs={3}>
                                        <div 
                                            onClick={() => setActiveImage(idx)}
                                            className={`rounded overflow-hidden ${activeImage === idx ? 'border border-primary' : 'border'}`}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <img
                                                src={img || "placeholder.jpg"}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="img-fluid"
                                                style={{ height: "60px", width: "100%", objectFit: "cover" }}
                                            />
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Col>
                    
                    {/* Product Information */}
                    <Col lg={7} md={6} style={{ position: 'relative', top: '6rem' }}>
                        <h1 className="h3 fw-bold mb-4">{product.productName || product.name}</h1>

                        <div className="mb-3 d-flex align-items-center" style={{position: 'relative', left:'18rem'}}>
                            {averageRating !== "No ratings" ? (
                                <>
                                    <div className="me-2">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className="me-1">
                                                {i < Math.floor(averageRating) ? (
                                                    <StarFill className="text-warning" size={16} />
                                                ) : (
                                                    <Star className="text-secondary" size={16} />
                                                )}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-secondary small">
                                        {averageRating} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                                    </span>
                                </>
                            ) : (
                                <span className="text-secondary small">No reviews yet</span>
                            )}
                        </div>
                        
                        <h2 className="h4 fw-bold text-primary mb-3">₹{product.Price || product.price}</h2>
                        
                        <div className="mb-3">
                            <h5 className="fw-bold mb-2 h6">Description</h5>
                            <p className="text-secondary">{product.productDescription || product.description || "No description available for this product."}</p>
                        </div>
                        
                        <div className="d-flex mt-3" style={{ position: 'relative', left: '16rem' }}>
                            <Button 
                                variant="primary" 
                                className="me-2 d-flex align-items-center"
                                onClick={handleAddToCart}
                            >
                                <CartPlus className="me-1" size={16} /> Add to Cart
                            </Button>
                            <Button 
                                variant="success" 
                                className="d-flex align-items-center"
                                onClick={handleBuyNow}
                            >
                                <CreditCard className="me-1" size={16} /> Buy Now
                            </Button>
                        </div>
                    </Col>
                </Row>
                
                {/* Compact Reviews Section */}
                <div className="mt-3 pt-2 border-top">
                    <h3 className="h5 fw-bold mb-2">Customer Reviews</h3>
                    
                    <Row>
                        {/* Review List */}
                        <Col md={7} className="mb-2 pe-md-4">
                            <div className="bg-light rounded p-2">
                                {reviews.length > 0 ? (
                                    <div style={{ maxHeight: "200px", overflowY: "auto" }} className="pe-2">
                                        {reviews.map((review, index) => (
                                            <div key={index} className={`${index > 0 ? 'border-top pt-2 mt-2' : ''}`}>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="d-flex align-items-center">
                                                        <span className="fw-medium small me-2">{review.name}</span>
                                                        <div>
                                                            {[...Array(5)].map((_, i) => (
                                                                <span key={i} style={{ fontSize: "10px" }} className="me-1">
                                                                    {i < Number(review.rating) ? (
                                                                        <span className="text-warning">★</span>
                                                                    ) : (
                                                                        <span className="text-secondary">☆</span>
                                                                    )}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {review.name === Username && (
                                                        <Button 
                                                            variant="link" 
                                                            size="sm" 
                                                            className="text-danger p-0"
                                                            style={{ fontSize: "0.7rem" }}
                                                            onClick={handleDeleteReview}
                                                        >
                                                            Delete
                                                        </Button>
                                                    )}
                                                </div>
                                                <p className="text-secondary mb-0" style={{ fontSize: "0.8rem" }}>{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-2">
                                        <p className="text-secondary mb-0" style={{ fontSize: "0.8rem" }}>No reviews yet. Be the first to review!</p>
                                    </div>
                                )}
                            </div>
                        </Col>
                        
                        {/* Review Form - More compact */}
                        <Col md={5} className="mb-2">
                            {isLoggedIn ? (
                                <div className="bg-light rounded p-2">
                                    <Form onSubmit={handleReviewSubmit} className="compact-form">
                                        <div className="d-flex align-items-center mb-2">
                                            <Form.Label className="mb-0 me-2" style={{ fontSize: "0.8rem" }}>Rating:</Form.Label>
                                            <Form.Select
                                                name="rating"
                                                value={review.rating}
                                                onChange={handleReviewChange}
                                                required
                                                size="sm"
                                                style={{ fontSize: "0.8rem", height: "calc(1.5em + 0.5rem + 2px)" }}
                                                className="w-auto"
                                                
                                            >
                                                <option value="5">5 Stars</option>
                                                <option value="4">4 Stars</option>
                                                <option value="3">3 Stars</option>
                                                <option value="2">2 Stars</option>
                                                <option value="1">1 Star</option>
                                            </Form.Select>
                                        </div>
                                        
                                        <Form.Control
                                            as="textarea"
                                            name="comment"
                                            value={review.comment}
                                            onChange={handleReviewChange}
                                            placeholder="Write your review here..."
                                            required
                                            rows={2}
                                            size="sm"
                                            style={{ fontSize: "0.8rem" }}
                                            className="mb-2"
                                        />
                                        
                                        <div className="text-end">
                                            <Button 
                                                variant="primary" 
                                                type="submit" 
                                                size="sm" 
                                                style={{ fontSize: "0.8rem", padding: "0.2rem 0.5rem" }}
                                            >
                                                Submit Review
                                            </Button>
                                        </div>
                                    </Form>
                                </div>
                            ) : (
                                <div className="bg-light rounded p-2 text-center">
                                    <small className="text-muted d-block mb-2">Please log in to leave a review</small>
                                    <Button 
                                        variant="outline-primary"
                                        onClick={() => navigate('/login')}
                                        size="sm"
                                        style={{ fontSize: "0.8rem", padding: "0.2rem 0.5rem" }}
                                    >
                                        Login to Review
                                    </Button>
                                </div>
                            )}
                        </Col>
                    </Row>
                </div>
            </Container>
        </div>
    );
};

export default InnerView;
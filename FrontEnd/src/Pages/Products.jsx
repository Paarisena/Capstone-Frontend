import { useState, useEffect } from "react";
import { fetchProducts } from "../Constant";
import { useParams } from "react-router-dom";
import { Form, Card, Button, Carousel } from "react-bootstrap";
import { reviewProduct, fetchReviews, deleteReview } from "../Constant";
import { addProductToCart } from "../Constant";
import { use } from "react";



const InnerView = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [quantities, setQuantities] = useState({});

    const Username = localStorage.getItem("Username") || "";

    const [review,setReview] = useState({name:Username,rating: 5 ,comment:""})
    const Isloggedin = localStorage.getItem("Usertoken") ? true : false;

    

    
    const handleReviewChange = (e) => {
            const {name, value} = e.target;
            setReview((prevReview) => ({
                ...prevReview,
                [name]: value
            }));
        }
    
    const handleAddToCart = async (e, id) => {
        e.preventDefault();
        try {
            const response = await addProductToCart({ itemId: id });
            if (response.success) {
                setCartItems((prevItems) => ({
                    ...prevItems,
                    [id]: response.cartItem
                }));
                setQuantities((prev) => ({
                    ...prev,
                    [id]: response.cartItem.quantity
                }));
            } else {
                console.log("Error adding product to cart:", response.message);
            }
        } catch (error) {
            console.log("Error adding product to cart:", error);
        }
    };
    

const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (Isloggedin) {
        try {
            const data = await reviewProduct(id, review); // data is already JSON
            console.log(data);
            if (data.success) {
               setReview({ name: Username, rating: 5, comment: "" });
               const refreshed = await fetchReviews(id);
               if (refreshed.success) setReviews(refreshed.reviews);
               alert("Review submitted successfully");
          } else {
           alert("Failed to submit review");
      }
        } catch (error) {
            alert("Error submitting review: " + error);
        }
    }
};

    const handleDeleteReview = async(e, name) =>{
        e.preventDefault();
        if(Isloggedin){
            try{
                const response = await deleteReview(id, name);
                console.log(response);
                if (response && response.success) {
                    // Re-fetch reviews from backend
                    const refreshed = await fetchReviews(id);
                    console.log(refreshed);
                    if (refreshed.success) setReviews(refreshed.reviews);
                    alert("Review deleted successfully");
                } else {
                    alert("Failed to delete review ");
                }
                }catch (error){
                alert("Error deleting review: " + error);
                }

            }
    }
        
    
useEffect(() => {
    const Reviews = async () => {
        try {
            const response = await fetchReviews(id);
            if (response.success) {
                setReviews(response.reviews);
                setReview({ name: Username, rating: 5, comment: "" });
            } else {
                alert("Failed to fetch reviews:", response.message);
            }
        } catch (error) {
            alert("Error fetching reviews:", error);
        }
    };
Reviews();
}, [id]);
    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await fetchProducts();
                const filteredProduct = Array.isArray(response.products)
                    ? response.products.find((p) => String(p._id) === String(id))
                    : response.products;
                setProduct(filteredProduct);
            } catch (error) {
                alert("Error fetching product:", error);
            }
        };
        fetch();
    }, [id]);
    
    if (!product) {
        return <p className="text-center text-danger">Loading...</p>;
    }

    const images = Array.isArray(product.Image) && product.Image.length > 0
        ? product.Image
        : [product.Images || product.image || "placeholder.jpg"];

    return (

            <div className="my-4" style={{ position:"absolute", top:"110px", maxWidth:"700px", margin:"0 auto"}} >
                <Carousel style={{left:"30rem", width:"30rem"}}>
                    {images.map((img, idx) => (
                        <Carousel.Item key={idx}>
                            <Card.Img
                                variant="top"
                                src={img || "placeholder.jpg"}
                                alt={product.productName || product.name || "Product Image"}
                                style={{  height: "600px", width: "50rem",  position: "relative", right: "10rem" }}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
                <Card.Body style={{ position:"relative", left:"56rem", bottom:"20rem"}}>
                    <Card.Title style={{bottom:"6rem", fontSize:"2rem", textDecoration:"underline", padding:"1rem"}}>{product.productName || product.name}</Card.Title>
                    <Card.Text style={{bottom:"3rem"}}>
                        <strong>Price:</strong> ₹{product.Price || product.price}
                    </Card.Text>
                    <Card.Text style={{bottom:"3rem"}}>
                        <strong>Description:</strong> {product.productDescription || product.description}
                    </Card.Text>
                
                    <div className="d-flex gap-2" style={{position:"relative", left:"10rem", bottom:"-2rem"}}>
                        <Button variant="success" size="sm" style={{ left:"64rem"}} onClick={(e) => handleAddToCart(e, product._id)}>Add to Cart</Button>
                        <Button variant="primary" size="sm"style={{left:"64rem"}}>Buy Now</Button>
                    </div>
                </Card.Body>


                <h3 style={{position:"relative", right:"3rem", bottom:"4rem", textDecoration:"underline"}}>Customer Review</h3>
                <div style={{position:"absolute", left:"0rem", top:"50rem", margin:"0 auto", width:"200rem", backgroundColor:"white"}}>   
                    {reviews.length === 0}
                    {reviews.map((review, index) => (
                        <div key={index} style={{position:"relative", right:"75rem"}}>
                            <h6>{review.name}</h6>
                            <div style={{position:"relative", left:"1rem"}}>
                                {Array.from({length: 5},(_, i)=>(
                                    <span key={i} style={{ color:i < Number(review.rating) ? "#ffc107" : "#e4e5e9", fontSize: "1.2rem"}}>
                                        ★
                                    </span>
                                    
                                ))}
                                </div>
                            <p style={{position:"relative", left:"1rem", bottom:"-0.5rem",}}>{review.comment}</p>

                        </div>
                    ))}
                    {Isloggedin ?(
                        
                        <>
                        <p>
                        {/* <strong>{Username}</strong> */}
                        </p>
                        <Form onSubmit={handleReviewSubmit} style={{  maxWidth: "900px"}}>
                            
                         <Form.Group className="mb-3" controlId="reviewRating" style={{position:"relative", left:"30rem", width:"400px"}}>
            <Form.Label>Rating</Form.Label>
            <Form.Select
                name="rating"
                value={review.rating}
                onChange={handleReviewChange}
                required
            >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
            </Form.Select>
        </Form.Group>
        <Form.Group className="mb-23" controlId="reviewComment" style={{position:"relative", left:"30rem", width:"400px"}}>
            <Form.Label>Your Review</Form.Label>
            <Form.Control
                as="textarea"
                name="comment"
                value={review.comment}
                onChange={handleReviewChange}
                placeholder="Your Review"
                required
                rows={3}
            />
            <br />
        </Form.Group>
        <Button variant="primary" type="submit" style={{position:"relative", left:"13rem"}}>
            Submit Review
        </Button>
        <Button variant="danger" onClick={(e)=>handleDeleteReview (e, review.name)}>Delete</Button>
        <br />
    </Form>
    </>
) : (
    <p style={{position:"relative", right:"60rem"}}>Please log in to leave a review.</p>
)}
                </div>
            </div>

    );

    }

export default InnerView
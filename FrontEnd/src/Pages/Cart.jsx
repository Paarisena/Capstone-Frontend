import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Container, Row, Col, Button, InputGroup, FormControl, Table } from "react-bootstrap";
import { addProductToCart, updateCart, getUserCart, deleteFromCart } from "../Constant";
import { Currency } from "../App";

const Cart = () => {
    const [cartItems, setCartItems] = useState({});
    const [quantities, setQuantities] = useState({});
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState({});
    const navigate = useNavigate();
    const Username = localStorage.getItem('Username');

    useEffect(() => {
        const fetchCartItems = async () => {
            setLoading(true);
            try {
                const userId = localStorage.getItem('userID'); 
                const Usertoken = localStorage.getItem('Usertoken');
                
                if (!userId || !Usertoken) {
                    navigate('/login');
                    return;
                }
                
                const response = await getUserCart(userId, Usertoken);
                if (response.success) {
                    setCartItems(response.cart);
                    // Set initial quantities for input fields
                    const initialQuantities = {};
                    Object.keys(response.cart).forEach(id => {
                        initialQuantities[id] = response.cart[id].quantity || 1;
                    });
                    setQuantities(initialQuantities);
                } else {
                    console.log("Error fetching cart items:", response.message);
                }
            } catch (error) {
                console.log("Error fetching cart items:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCartItems();
    }, [navigate]);

    const handleRemoveFromCart = async (itemId) => {
        try {
            const userId = localStorage.getItem('userID');
            const Usertoken = localStorage.getItem('Usertoken');
            
            // Set updating state for this item
            setUpdating(prev => ({ ...prev, [itemId]: true }));
            
            const response = await deleteFromCart(userId, itemId, Usertoken);
            if (response.success) {
                setCartItems((prevItems) => {
                    const newItems = { ...prevItems };
                    delete newItems[itemId];
                    return newItems;
                });
            } else {
                console.log("Error removing item from cart:", response.message);
            }
        } catch (error) {
            console.log("Error removing item from cart:", error);
        } finally {
            setUpdating(prev => ({ ...prev, [itemId]: false }));
        }
    }

    const handleQuantityChange = (itemId, value) => {
        // Ensure the value is at least 1
        const qty = Math.max(1, Number(value));
        setQuantities((prev) => ({
            ...prev,
            [itemId]: qty
        }));
    };

    const handleUpdateCart = async (itemId) => {
        const quantity = quantities[itemId];
        
        // Set updating state for this item
        setUpdating(prev => ({ ...prev, [itemId]: true }));
        
        try {
            const userId = localStorage.getItem('userID');
            const Usertoken = localStorage.getItem('Usertoken');
            const response = await updateCart(userId, itemId, quantity, Usertoken);
            
            if (response.success) {
                setCartItems((prevItems) => ({
                    ...prevItems,
                    [itemId]: {
                        ...prevItems[itemId],
                        quantity
                    }
                }));
            } else {
                console.log("Error updating cart:", response.message);
            }
        } catch (error) {
            console.log("Error updating cart:", error);
        } finally {
            setUpdating(prev => ({ ...prev, [itemId]: false }));
        }
    };

    const handleProductClick = (itemId) => {
        navigate(`/products/${itemId}`);
    };

    const handleCheckout = () => {
        navigate('/payment', { 
            state: { 
                cartItems: Object.entries(cartItems).map(([id, item]) => ({
                    _id: id,
                productId: id,
                itemId: id,
                productName: item.name || item.productName,
                Price: parseFloat(item.price || 0),
                Image: item.Image,
                quantity: quantities[id] || item.quantity || 1,
                Category: item.Category
            })),
            get totalAmount() {
                return this.cartItems.reduce((sum, item) => sum + (item.Price * item.quantity), 0);
            }
        } 
    });
};
    // Calculate total
    const cartTotal = Object.values(cartItems).reduce(
        (sum, item) => sum + (parseFloat(item.price) || 0) * (quantities[item._id] || item.quantity || 1),
        0
    );

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading your cart...</p>
            </Container>
        );
    }

    return (
        <Container className="py-4" style={{ transform: 'none', transition: 'none' }}>
            <Card className="shadow-sm mb-4">
                <Card.Header className="bg-white">
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">{Username}'s Cart</h4>
                        <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => navigate('/collections')}
                        >
                            Continue Shopping
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    {Object.keys(cartItems).length > 0 ? (
                        <div >
                            <Table >
                                <thead className="bg-light">
                                    <tr>
                                        <th>Product</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(cartItems).map((itemId) => {
                                        const item = cartItems[itemId];
                                        return (
                                            <tr key={itemId}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <img
                                                            src={
                                                                (item.Image && item.Image[0]) ||
                                                                item.image 
            
                                                            }
                                                            alt={item.name || "Product"}
                                                            className="img-fluid rounded"
                                                            style={{ 
                                                                height: "80px", 
                                                                width: "80px", 
                                                                objectFit: "cover", 
                                                                cursor: "pointer",
                                                                transform: "none",
                                                                transition: "none"
                                                            }}
                                                            onClick={() => handleProductClick(itemId)}
                                                        />
                                                        <div className="ms-3">
                                                            <h6 className="mb-0" style={{ cursor: 'pointer' }} onClick={() => handleProductClick(itemId)}>
                                                                {item.name || item.productName || 'Product'}
                                                            </h6>
                                                            <small className="text-muted">{item.Category || 'Art'}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{Currency}{item.price}</td>
                                                <td>
                                                    <InputGroup className="w-auto">
                                                        <FormControl
                                                            type="number"

                                                            min={0}
                                                            value={quantities[itemId] || item.quantity || 1}
                                                            onChange={e => handleQuantityChange(itemId, e.target.value)}
                                                            style={{ width: "80px" }}
                                                        />
                                                    </InputGroup>
                                                </td>
                                                <td>
                                                    <Button 
                                                        variant="primary" 
                                                        size="sm"
                                                        onClick={() => handleUpdateCart(itemId)}
                                                        disabled={updating[itemId]}
                                                        className="me-2"
                                                    >
                                                        {updating[itemId] ? (
                                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                        ) : (
                                                            'Update'
                                                        )}
                                                    </Button>
                                                    <Button 
                                                        variant="danger" 
                                                        size="sm"
                                                        onClick={() => handleRemoveFromCart(itemId)}
                                                        disabled={updating[itemId]}
                                                    >
                                                        {updating[itemId] ? (
                                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                        ) : (
                                                            'Remove'
                                                        )}
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <h5>Your cart is empty</h5>
                            <p className="text-muted mb-4">Add items to your cart to see them here.</p>
                            <Button 
                                variant="primary" 
                                onClick={() => navigate('/collections')}
                            >
                                Browse Collections
                            </Button>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {Object.keys(cartItems).length > 0 && (
                <Row className="mt-4">
                    <Col md={6} className="ms-auto">
                        <Card className="shadow-sm">
                            <Card.Header className="bg-white">
                                <h5 className="mb-0">Order Summary</h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Subtotal:</span>
                                    <span>₹{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Shipping:</span>
                                    <span>Free</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between mb-3">
                                    <h5>Total:</h5>
                                    <h5>{Currency}{cartTotal.toFixed(2)}</h5>
                                </div>
                                <Button 
                                    variant="primary" 
                                    className="w-100"
                                    onClick={handleCheckout}
                                >
                                    Proceed to Checkout
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default Cart;
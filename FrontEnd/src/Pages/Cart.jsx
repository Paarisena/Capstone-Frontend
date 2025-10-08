import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Button, InputGroup, FormControl } from "react-bootstrap";
import { addProductToCart, updateCart, getUserCart } from "../Constant";

const Cart = () => {
    const [cartItems, setCartItems] = useState({});
    const [quantities, setQuantities] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await getUserCart();
                if (response.success) {
                    setCartItems(response.cartData);
                    // Set initial quantities for input fields
                    const initialQuantities = {};
                    Object.keys(response.cartData).forEach(id => {
                        initialQuantities[id] = response.cartData[id].quantity || 1;
                    });
                    setQuantities(initialQuantities);
                } else {
                    console.error("Error fetching cart items:", response.message);
                }
            } catch (error) {
                console.error("Error fetching cart items:", error);
            }
        };
        fetchCartItems();
    }, []);

    

    const handleQuantityChange = (productId, value) => {
        const qty = Math.max(1, Number(value));
        setQuantities((prev) => ({
            ...prev,
            [productId]: qty
        }));
    };

    const handleUpdateCart = async (productId) => {
        const quantity = quantities[productId];
        try {
            const response = await updateCart(productId, quantity);
            if (response.success) {
                setCartItems((prevItems) => ({
                    ...prevItems,
                    [productId]: {
                        ...prevItems[productId],
                        quantity
                    }
                }));
            } else {
                console.error("Error updating cart:", response.message);
            }
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };

    const handleProductClick = (productId) => {
        navigate(`/products/${productId}`);
    };

    // Calculate total
    const cartTotal = Object.values(cartItems).reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0
    );

    return (
        <>
            <h1>Your Cart</h1>
            <Row>
                {Object.keys(cartItems).length > 0 ? (
                    Object.keys(cartItems).map((itemId) => (
                        <Col key={itemId} md={4} sm={6} xs={12} className="mb-4">
                            <Card style={{ width: '18rem' }} className="h-100 shadow-sm">
                                <Card.Img
                                    variant="top"
                                    src={cartItems[itemId].image || "placeholder.jpg"}
                                    alt={cartItems[itemId].name || "Product Image"}
                                    style={{
                                        height: "200px",
                                        width: "100%",
                                        objectFit: "cover",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => handleProductClick(itemId)}
                                />
                                <Card.Body className="d-flex flex-column justify-content-between align-items-center">
                                    <Card.Title className="text-center">{cartItems[itemId].name}</Card.Title>
                                    <Card.Text className="text-center">Price: ₹{cartItems[itemId].price}</Card.Text>
                                    <InputGroup className="mb-2" style={{ width: "120px" }}>
                                        <FormControl
                                            type="number"
                                            min={1}
                                            value={quantities[itemId] || cartItems[itemId].quantity || 1}
                                            onChange={e => handleQuantityChange(itemId, e.target.value)}
                                        />
                                        <Button
                                            variant="primary"
                                            onClick={() => handleUpdateCart(itemId)}
                                        >
                                            Update
                                        </Button>
                                    </InputGroup>
                                    <Button
                                        variant="success"
                                        onClick={() => handleAddToCart(itemId)}
                                    >
                                        Add One More
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p>Your cart is empty.</p>
                )}
            </Row>
            <h3 className="mt-4">Cart Total: ₹{cartTotal}</h3>
        </>
    );
};

export default Cart;
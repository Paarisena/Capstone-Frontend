import React, { useState } from 'react';
import { processPayment, confirmPayment, getUserCart, fetchUserProfile, pollPaymentStatus } from '../Constant.js';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements, } from '@stripe/react-stripe-js';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePaymentStatusListener } from '../Constant.js';

import './Payment.css';
import { useEffect } from 'react';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);


const PaymentForm = ({ cartItems, totalAmount, shippingAddress, onPaymentSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const navigate = useNavigate();

    // ✅ Listen for real-time webhook updates
    usePaymentStatusListener(currentOrderId, (status, payment) => {
        console.log('🎉 Payment status updated from webhook:', status);
        setPaymentStatus(status);
        
        if (status === 'succeeded') {
            setMessage('Payment successful! Redirecting...');
            setMessageType('success');
            setLoading(false);
            
            // Clear cart and redirect
            localStorage.removeItem('cartItems');
            setTimeout(() => {
                navigate(`/payment-success/${payment.orderId}`);
            }, 2000);
        } else if (status === 'failed') {
            setMessage('Payment failed. Please try again.');
            setMessageType('error');
            setLoading(false);
        }
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage('');

        if (!stripe || !elements) {
            setMessage('Payment system not loaded. Please refresh the page.');
            setMessageType('error');
            setLoading(false);
            return;
        }

        try {
            // Step 1: Create payment intent
            setMessage('Creating payment...');
            const paymentResult = await processPayment(cartItems, totalAmount, shippingAddress);
            
            if (!paymentResult.success) {
                throw new Error(paymentResult.message);
            }

            // Step 2: Start listening for webhook updates
            setCurrentOrderId(paymentResult.orderId);
            console.log('🎯 Started listening for order:', paymentResult.orderId);

            // Step 3: Confirm payment with Stripe
            setMessage('Processing payment...');
            setPaymentStatus('processing');
            
            const { error, paymentIntent } = await stripe.confirmCardPayment(
                paymentResult.clientSecret,
                {
                    payment_method: {
                        card: elements.getElement(CardElement),
                        billing_details: {
                            name: localStorage.getItem('Username') || 'Customer',
                            email: localStorage.getItem('email') || '',
                        },
                    }
                }
            );

            if (error) {
                throw new Error(error.message);
            }

            // Step 4: Wait for webhook to confirm
            if (paymentIntent.status === 'succeeded') {
                // Sometimes immediate success
                setMessage('Payment successful! Redirecting...');
                setMessageType('success');
                setPaymentStatus('succeeded');
                localStorage.removeItem('cartItems');
                setTimeout(() => {
                    navigate(`/payment-success/${paymentResult.orderId}`);
                }, 2000);
            } else {
                // Wait for webhook confirmation
                setMessage('Confirming payment... Please wait');
                setPaymentStatus('confirming');
                // The webhook listener will handle the success
            }
            
        } catch (error) {
            console.error('Payment error:', error);
            setMessage(`Payment failed: ${error.message}`);
            setMessageType('error');
            setLoading(false);
            setPaymentStatus('failed');
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
                padding: '12px',
            },
            invalid: {
                color: '#9e2146',
            },
        },
        hidePostalCode: true,
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Show payment status */}
            {currentOrderId && (
                <div className="payment-status-indicator">
                    <p>Status: <strong>{paymentStatus}</strong></p>
                    {paymentStatus === 'processing' || paymentStatus === 'confirming' ? (
                        <div className="spinner"></div>
                    ) : null}
                </div>
            )}
            
            <CardElement options={cardElementOptions} />
            
            <button 
                type="submit" 
                disabled={loading || !stripe} 
                className={`payment-button ${loading ? 'loading' : ''}`}
            >
                {loading ? (
                    <>
                        <span className="spinner"></span>
                        Processing...
                    </>
                ) : (
                    `Pay $${totalAmount} SGD`
                )}
            </button>
            
            {message && (
                <div className={`alert alert-${messageType === 'error' ? 'danger' : 'success'}`}>
                    {message}
                </div>
            )}
        </form>
    );
};

const Payment = () => {
    const location = useLocation();
    const [cartItems, setCartItems] = useState(location.state?.cartItems || []);
    const [totalAmount, setTotalAmount] = useState(location.state?.totalAmount || 0);
    const [loading, setLoading] = useState(false);
    
    // Initialize with profile address from localStorage
    const [shippingAddress, setShippingAddress] = useState({
        street: localStorage.getItem('Address') || '',
        city: localStorage.getItem('City') || '',
        state: localStorage.getItem('State') || '',
        zip: localStorage.getItem('PostalCode') || ''
    });

    // Fetch profile address if localStorage is empty
    useEffect(() => {
        const fetchProfileAddress = async () => {
            if (!shippingAddress.street) { // Only fetch if no address in localStorage
                try {
                    const token = localStorage.getItem("Usertoken");
                    const response = await fetchUserProfile(token);
                    
                    if (response.success && response.profile.address) {
                        const profileAddress = response.profile.address;
                        setShippingAddress({
                            street: profileAddress.street || '',
                            city: profileAddress.city || '',
                            state: profileAddress.state || '',
                            zip: profileAddress.zip || ''
                        });
                    }
                } catch (error) {
                    console.error('Error fetching profile address:', error);
                }
            }
        };

        fetchProfileAddress();
    }, []);

    // Add this useEffect for handling Buy Now flow
    useEffect(() => {
        // Check if this is from Buy Now
        if (location.state?.fromBuyNow) {
            console.log("💰 Payment from Buy Now detected");
            console.log("📦 Items:", location.state.cartItems);
            console.log("💰 Total:", location.state.totalAmount);
            
            // Set the items and total directly
            setCartItems(location.state.cartItems);
            setTotalAmount(location.state.totalAmount);
            return; // Skip the cart fetching
        }
        
        // Original cart fetching logic for regular checkout
        if (location.state?.cartItems?.length > 0) return; 
        
        (async () => {
            const userId = localStorage.getItem('userID');
            const token = localStorage.getItem('UserToken');
            
            if (!userId || !token) return window.location.href = '/login';
            
            setLoading(true);
            
            try {
                const { success, cart } = await getUserCart(userId, token);
                
                if (success && cart) {
                    const items = Object.entries(cart).map(([id, item]) => ({
                        _id: id,
                        productId: id,
                        itemId: id,
                        productName: item.name || item.productName,
                        Price: parseFloat(item.price || item.Price || 0),
                        Image: item.Image,
                        quantity: item.quantity || 1,
                        Category: item.Category
                    }));
                    
                    setCartItems(items);
                    setTotalAmount(items.reduce((sum, item) => sum + (item.Price * item.quantity), 0));
                }
            } catch (error) {
                console.error('Cart fetch error:', error);
            } finally {
                setLoading(false);
            }
        })();
    }, [location.state]); // Add location.state as dependency

    const handleAddressChange = (field, value) => {
        setShippingAddress(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Update localStorage when address changes
        const storageKeys = {
            street: 'Address',
            city: 'City',
            state: 'State',
            zip: 'PostalCode'
        };
        
        if (storageKeys[field]) {
            localStorage.setItem(storageKeys[field], value);
        }
    };

    const onPaymentSuccess = (orderId) => {
        localStorage.removeItem('cartItems');
        window.location.href = `/payment-success/${orderId}`;
    };

    if (loading) {
        return (
            <div className="payment-loading">
                <div className="spinner"></div>
                <p>Loading payment details...</p>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="empty-cart">
                <h2>No items to checkout</h2>
                <button onClick={() => window.location.href = '/cart'}>
                    Go to Cart
                </button>
            </div>
        );
    }

    return (
        <Elements stripe={stripePromise}>
            <div className="payment-page">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="payment-section">
                                <h2 className="section-title">Payment Details</h2>
                                
                                {/* Shipping Address */}
                                <div className="card address-card">
                                    <div className="card-body">
                                        <h5 className="card-title">Shipping Address</h5>
                                        <div className="row">
                                            <div className="col-12 mb-3">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Street Address"
                                                    value={shippingAddress.street}
                                                    onChange={(e) => setShippingAddress(prev => ({ ...prev, street: e.target.value }))}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="City"
                                                    value={shippingAddress.city}
                                                    onChange={(e) => handleAddressChange('city', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Postal Code"
                                                    value={shippingAddress.zip}
                                                    onChange={(e) => handleAddressChange('zip', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Form */}
                                <div className="card payment-card">
                                    <div className="card-body">
                                        <h5 className="card-title">Payment Method</h5>
                                        <PaymentForm 
                                            cartItems={cartItems}
                                            totalAmount={totalAmount}
                                            shippingAddress={shippingAddress}
                                            onPaymentSuccess={onPaymentSuccess}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="order-summary">
                                <div className="card summary-card">
                                    <div className="card-body">
                                        <h5 className="card-title">Order Summary</h5>
                                        
                                        <div className="order-items">
                                            {cartItems.map((item, index) => (
                                                <div key={item._id || index} className="order-item">
                                                    <div className="item-image">
                                                        <img 
                                                            src={item.Image?.[0] || '/placeholder.jpg'} 
                                                            alt={item.productName || 'Product'}
                                                        />
                                                    </div>
                                                    <div className="item-details">
                                                        <h6>{item.productName || 'Product'}</h6>
                                                        <p>Qty: {item.quantity}</p>
                                                        <p className="item-price">${item.Price}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <hr />
                                        
                                        <div className="order-totals">
                                            <div className="total-line">
                                                <span>Subtotal:</span>
                                                <span>${totalAmount.toFixed(2)}</span>
                                            </div>
                                            <div className="total-line">
                                                <span>Shipping:</span>
                                                <span>Free</span>
                                            </div>
                                            <div className="total-line total-final">
                                                <strong>
                                                    <span>Total:</span>
                                                    <span>${totalAmount.toFixed(2)} SGD</span>
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Elements>
    );
};

export default Payment;
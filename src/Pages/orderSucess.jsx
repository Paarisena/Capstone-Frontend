import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPayment } from '../Constant.js';


const OrderSuccess = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                setError('Invalid order ID');
                setLoading(false);
                return;
            }

            try {
                const result = await getPayment(orderId);
                if (result.success) {
                    setOrderDetails(result.payment);
                } else {
                    setError('Order not found');
                }
            } catch (err) {
                setError('Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className="order-loading">
                <div className="spinner"></div>
                <p>Loading order confirmation...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="order-error">
                <h2>Something went wrong</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/products')} className="btn btn-primary">
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="order-success-page">
            <div className="container">
                {/* Success Header */}
                <div className="success-header">
                    <div className="success-icon">✅</div>
                    <h1>Order Placed Successfully!</h1>
                    <p>Thank you! Your order has been confirmed.</p>
                </div>

                {/* Order Details */}
                <div className="order-card">
                    <h3>Order Information</h3>
                    <div className="order-info">
                        <div className="info-row">
                            <span>Order Number:</span>
                            <span>#{orderDetails?.orderId || orderId}</span>
                        </div>
                        <div className="info-row">
                            <span>Date:</span>
                            <span>{new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="info-row">
                            <span>Status:</span>
                            <span className="status-success">CONFIRMED</span>
                        </div>
                        <div className="info-row">
                            <span>Total:</span>
                            <span className="total">${orderDetails?.amount || '0.00'} SGD</span>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                {orderDetails?.items?.length > 0 && (
                    <div className="order-card">
                        <h3>Order Items</h3>
                        {orderDetails.items.map((item, index) => (
                            <div key={index} className="order-item">
                                <img 
                                    src={item.image || '/placeholder.jpg'} 
                                    alt={item.name || 'Product'}
                                />
                                <div className="item-info">
                                    <h4>{item.name || item.productName || 'Product'}</h4>
                                    <p>Qty: {item.quantity || 1} × ${item.price || '0.00'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Shipping Address */}
                {orderDetails?.shippingAddress && (
                    <div className="order-card">
                        <h3>Shipping Address</h3>
                        <div className="address">
                            <p>{orderDetails.shippingAddress.street}</p>
                            <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}</p>
                            <p>{orderDetails.shippingAddress.zip}</p>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button 
                        onClick={() => navigate('/collections')}
                        className="btn btn-primary"
                    >
                        Continue Shopping
                    </button>
                    <button 
                        onClick={() => navigate('/view-order')}
                        className="btn btn-secondary"
                    >
                        View Orders
                    </button>
                </div>

                {/* Support */}
                <div className="support">
                    <p>Need help? Contact us at <a href="mailto:support@store.com">support@store.com</a></p>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
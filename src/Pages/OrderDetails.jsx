import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { orderDetails } from "../Constant";
import './OrderDetails.css';

const OrderDetails = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { orderId } = useParams(); // Get orderId from URL params
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                if (!orderId) {
                    setError('Order ID is required');
                    return;
                }

                console.log('Fetching order details for ID:', orderId);
                const result = await orderDetails(orderId); // Pass the order ID
                console.log('Order details result:', result);

                if (!result.success) {
                    setError('Failed to load order details');
                    return;
                }

                setOrder(result.order);
            } catch (err) {
                console.error('Error fetching order details:', err);
                setError('Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]); // Dependency on orderId instead of navigate

    const getStatusColor = (status) => {
        const s = status?.toLowerCase();
        if (s === 'succeeded' || s === 'completed') return 'success';
        if (s === 'pending') return 'pending';
        if (s === 'failed' || s === 'cancelled') return 'failed';
        return 'default';
    };

    if (loading) {
        return (
            <div className="order-details-loading">
                <div className="spinner"></div>
                <p>Loading order details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="order-details-error">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/view-order')}>Back to Orders</button>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="order-details-error">
                <h2>Order Not Found</h2>
                <p>The requested order could not be found.</p>
                <button onClick={() => navigate('/view-order')}>Back to Orders</button>
            </div>
        );
    }

    return (
        <div className="order-details">
            <div className="order-details-header">
                <button onClick={() => navigate('/view-order')} className="back-button">
                    ← Back to Orders
                </button>
                <h1>Order Details</h1>
            </div>

            <div className="order-details-card">
                <div className="order-summary">
                    <div className="order-info">
                        <h2>Order #{order.orderId || order.transactionId || order._id}</h2>
                        <span className={`status ${getStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus?.toUpperCase() || 'UNKNOWN'}
                        </span>
                    </div>
                    
                    <div className="order-meta">
                        <div className="meta-item">
                            <strong>Order Date:</strong>
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="meta-item">
                            <strong>Total Amount:</strong>
                            <span>${order.amount || '0.00'} {order.currency || 'SGD'}</span>
                        </div>
                        <div className="meta-item">
                            <strong>Payment Method:</strong>
                            <span>Credit Card</span>
                        </div>
                    </div>
                </div>

                {/* Shipping Address */}
                {order.shippingAddress && (
                    <div className="shipping-section">
                        <h3>Shipping Address</h3>
                        <div className="address-card">
                            {typeof order.shippingAddress === 'string' ? (
                                <p>{order.shippingAddress}</p>
                            ) : (
                                <>
                                    <p>{order.shippingAddress.street}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                                    <p>{order.shippingAddress.zip}</p>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Order Items */}
                <div className="items-section">
                    <h3>Order Items ({order.items?.length || 0})</h3>
                    <div className="items-list">
                        {order.items && order.items.length > 0 ? (
                            order.items.map((item, index) => (
                                <div key={item._id || index} className="item-card">
                                    <div className="item-image">
                                        <img 
                                            src={item.productId?.Image?.[0] || item.image || '/placeholder.jpg'} 
                                            alt={item.productId?.productName || item.name || 'Product'}
                                        />
                                    </div>
                                    <div className="item-details">
                                        <h4>{item.productId?.productName || item.name || 'Product'}</h4>
                                        <p className="item-price">
                                            ${item.productId?.Price || item.price || '0.00'} × {item.quantity || 1}
                                        </p>
                                        <p className="item-total">
                                            Total: ${((item.productId?.Price || item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No items found in this order.</p>
                        )}
                    </div>
                </div>

                {/* Order Actions */}
                <div className="order-actions">
                    {order.paymentStatus?.toLowerCase() === 'succeeded' && (
                        <button 
                            onClick={() => navigate('/cart')} 
                            className="reorder-button"
                        >
                            Reorder Items
                        </button>
                    )}
                    <button 
                        onClick={() => window.print()} 
                        className="print-button"
                    >
                        Print Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserPayments } from '../Constant.js';
import './ViewOrder.css';

const ViewOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userId = localStorage.getItem('userID');
                const token = localStorage.getItem('Usertoken');
                
                if (!userId || !token) {
                    navigate('/login');
                    return;
                }

                const result = await getUserPayments(userId, token);
                setOrders(result.success ? result.payments || [] : []);
                if (!result.success) setError('Failed to load orders');
            } catch (err) {
                setError('Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    const getStatusColor = (status = '') => {
        const s = status.toLowerCase();
        if (s === 'succeeded' || s === 'completed') return 'success';
        if (s === 'pending') return 'pending';
        if (s === 'failed' || s === 'cancelled') return 'failed';
        return 'default';
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Loading orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error">
                <h2>Unable to load orders</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
        );
    }

    return (
        <div className="view-orders">
            <h1>My Orders</h1>
            
            {orders.length === 0 ? (
                <div className="no-orders">
                    <h3>No orders found</h3>
                    <p>Start shopping to see your orders here</p>
                    <button onClick={() => navigate('/collections')}>Shop Now</button>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order._id || order.orderId} className="order">
                            <div className="order-header">
                                <h3>Order #{order.orderId}</h3>
                                <span className={`status ${getStatusColor(order.paymentStatus)}`}>
                                    {order.paymentStatus?.toUpperCase() || 'UNKNOWN'}
                                </span>
                            </div>
                            
                            <div className="order-info">
                                <p>Date: {new Date(order.createdAt || Date.now()).toLocaleDateString()}</p>
                                <p>Total: ${order.amount || '0.00'} {order.currency || 'SGD'}</p>
                                {order.items && <p>Items: {order.items.length}</p>}
                            </div>

                            {order.items && order.items.length > 0 && (
                                <div className="order-items">
                                    {order.items.slice(0, 2).map((item, index) => (
                                        <div key={index} className="item">
                                            <img 
                                                src={item.productId?.Image?.[0] || '/placeholder.jpg'} 
                                                alt={item.productId?.productName || item.name || 'Product'} 
                                            />
                                            <div>
                                                <h4>{item.productId?.productName || item.name || item.productName || 'Product'}</h4>
                                                <p>Qty: {item.quantity || 1} × ${item.productId?.Price || item.price || '0.00'}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {order.items.length > 2 && (
                                        <p className="more">+{order.items.length - 2} more items</p>
                                    )}
                                </div>
                            )}

                            <div className="order-actions">
                                <button onClick={() => navigate(`/order-details/${order._id || order.orderId}`)}>
                                    View Details
                                </button>
                                {order.paymentStatus?.toLowerCase() === 'succeeded' && (
                                    <button onClick={() => navigate('/cart')}>
                                        Reorder
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewOrder;
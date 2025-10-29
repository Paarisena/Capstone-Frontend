import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPayment, reorderProduct } from '../Constant.js';

const Reorder = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reordering, setReordering] = useState(false);

    // Fetch order on component mount
    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    const fetchOrder = async () => {
        if (!orderId) {
            setError('Invalid order ID');
            setLoading(false);
            return;
        }

        try {
            const result = await getPayment(orderId);
            console.log('Order Result:', result);
            if (result.success) {
                setOrderDetails(result.payment);
            } else {
                setError('Order not found');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    const handleReorder = async () => {
        if (!orderDetails || !orderDetails.items || orderDetails.items.length === 0) {
            alert('No items to reorder');
            return;
        }
        
        const token = localStorage.getItem('Usertoken');
        const userId = localStorage.getItem('userID');
        
        if (!token) {
            alert('⚠️ Please login to add items to cart');
            return;
        }
        
        setReordering(true);
        
        try {
            // Call the reorderProduct function with orderId
            const result = await reorderProduct(orderId);
            
            console.log('Reorder result:', result);
            
            if (result.success) {
                alert(`✅ Successfully added ${orderDetails.items.length} item(s) to cart!`);
                
                // Wait a bit for backend to process, then navigate
                setTimeout(() => {
                    if (userId) {
                        window.location.href = `/cart/${userId}`;
                    } else {
                        window.location.href = '/cart';
                    }
                }, 300);
            } else {
                alert(`❌ ${result.message || 'Failed to add items to cart'}`);
            }
            
        } catch (err) {
            console.error('Reorder error:', err);
            alert('❌ An error occurred. Please try again.');
        } finally {
            setReordering(false);
        }
    };

    // Inline Styles
    const styles = {
        page: {
            padding: '40px 20px',
            minHeight: '100vh',
            width: '105%',
            background: 'linear-gradient(135deg, #ffffffff 0%, #ffffffff 100%)',
        },
        container: {
            maxWidth: '1000px',
            margin: '0 auto',
            width: '100%',
        },
        header: {
            textAlign: 'center',
            marginBottom: '40px',
            color: 'black',
        },
        headerTitle: {
            fontSize: '36px',
            fontWeight: '700',
            marginBottom: '10px',
            textShadow: '2px 2px 4px rgba(138, 72, 72, 0.2)',
        },
        headerSubtitle: {
            fontSize: '18px',
            opacity: '0.9',
        },
        card: {
            background: 'white',
            padding: '30px',
            marginBottom: '20px',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        },
        cardTitle: {
            fontSize: '24px',
            fontWeight: '600',
            color: '#1d5fa0ff', 
            marginBottom: '20px',
            borderBottom: '3px solid #667eea',
            paddingBottom: '12px',
        },
        infoRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 0',
            borderBottom: '1px solid #f0f0f0',
        },
        infoLabel: {
            color: '#6c757d',
            fontWeight: '500',
            fontSize: '16px',
        },
        infoValue: {
            color: '#2c3e50',
            fontWeight: '600',
            fontSize: '16px',
        },
        status: {
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
        },
        statusConfirmed: {
            background: '#d4edda',
            color: '#28a745',
        },
        total: {
            fontSize: '26px',
            fontWeight: '700',
            color: '#667eea',
        },
        orderItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '12px',
            marginBottom: '15px',
            border: '2px solid #e9ecef',
            transition: 'all 0.3s ease',
        },
        orderItemImage: {
            width: '100px',
            height: '100px',
            objectFit: 'cover',
            borderRadius: '10px',
            border: '3px solid #dee2e6',
            flexShrink: 0,
        },
        itemInfo: {
            flex: 1,
        },
        itemName: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#2c3e50',
            marginBottom: '8px',
        },
        itemDetails: {
            color: '#6c757d',
            fontSize: '15px',
        },
        itemPrice: {
            fontSize: '20px',
            fontWeight: '700',
            color: '#667eea',
        },
        address: {
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #e9ecef',
        },
        addressLine: {
            margin: '8px 0',
            color: '#495057',
            fontSize: '16px',
        },
        buttonContainer: {
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            marginTop: '30px',
            flexWrap: 'wrap',
        },
        btnPrimary: {
            padding: '16px 40px',
            border: 'none',
            borderRadius: '10px',
            fontSize: '18px',
            fontWeight: '700',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '1px',
        },
        btnSecondary: {
            padding: '16px 40px',
            border: '2px solid #667eea',
            borderRadius: '10px',
            fontSize: '18px',
            fontWeight: '700',
            cursor: 'pointer',
            background: 'white',
            color: '#667eea',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '1px',
        },
        btnDisabled: {
            opacity: 0.6,
            cursor: 'not-allowed',
        },
        loading: {
            textAlign: 'center',
            padding: '100px 20px',
            color: 'black',
        },
        spinner: {
            border: '6px solid #f3f3f3',
            borderTop: '6px solid #667eea',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px',
        },
        loadingText: {
            fontSize: '20px',
            fontWeight: '500',
            color: '#6c757d',
        },
        error: {
            textAlign: 'center',
            padding: '60px 20px',
            background: 'white',
            borderRadius: '15px',
            margin: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        },
        errorTitle: {
            color: '#dc3545',
            fontSize: '32px',
            marginBottom: '15px',
            fontWeight: '700',
        },
        errorText: {
            color: '#6c757d',
            fontSize: '18px',
            marginBottom: '30px',
        },
        emptyState: {
            textAlign: 'center',
            padding: '60px 20px',
            color: '#6c757d',
        },
        emptyIcon: {
            fontSize: '80px',
            marginBottom: '20px',
        },
    };

    // Add animations
    const animationStyle = document.createElement('style');
    animationStyle.innerHTML = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
            .reorder-mobile-container {
                padding: 20px 10px !important;
            }
            .reorder-mobile-card {
                padding: 20px 15px !important;
            }
            .reorder-mobile-header h1 {
                font-size: 26px !important;
            }
            .reorder-mobile-item {
                flex-direction: column !important;
                text-align: center !important;
            }
            .reorder-mobile-item img {
                width: 80px !important;
                height: 80px !important;
            }
            .reorder-mobile-buttons {
                flex-direction: column !important;
            }
            .reorder-mobile-buttons button {
                width: 100% !important;
            }
        }
        
        @media (max-width: 480px) {
            .reorder-mobile-header h1 {
                font-size: 22px !important;
            }
            .reorder-mobile-item img {
                width: 70px !important;
                height: 70px !important;
            }
        }
    `;
    if (!document.head.querySelector('#reorder-animations')) {
        animationStyle.id = 'reorder-animations';
        document.head.appendChild(animationStyle);
    }

    if (loading) {
        return (
            <div style={styles.page}>
                <div style={styles.loading}>
                    <div style={styles.spinner}></div>
                    <p style={styles.loadingText}>Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.page}>
                <div style={styles.error}>
                    <h2 style={styles.errorTitle}>⚠️ Error</h2>
                    <p style={styles.errorText}>{error}</p>
                    <button 
                        onClick={() => navigate('/view-order')}
                        style={styles.btnPrimary}
                        onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                        }}
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page} className="reorder-mobile-container">
            <div style={styles.container}>
                {/* Header */}
                <div style={styles.header} className="reorder-mobile-header">
                    <h1 style={styles.headerTitle}>🔄 Reorder Items</h1>
                    <p style={styles.headerSubtitle}>Review your previous order and add items to cart</p>
                </div>

                {/* Order Information */}
                <div style={styles.card} className="reorder-mobile-card">
                    <h3 style={styles.cardTitle}>Order Information</h3>
                    <div>
                        <div style={styles.infoRow}>
                            <span style={styles.infoLabel}>Order ID:</span>
                            <span style={styles.infoValue}>#{orderDetails?.orderId || orderId}</span>
                        </div>
                        <div style={styles.infoRow}>
                            <span style={styles.infoLabel}>Order Date:</span>
                            <span style={styles.infoValue}>
                                {orderDetails?.createdAt ? new Date(orderDetails.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                        <div style={styles.infoRow}>
                            <span style={styles.infoLabel}>Status:</span>
                            <span style={{...styles.status, ...styles.statusConfirmed}}>CONFIRMED</span>
                        </div>
                        <div style={{...styles.infoRow, borderBottom: 'none'}}>
                            <span style={styles.infoLabel}>Total Amount:</span>
                            <span style={{...styles.infoValue, ...styles.total}}>
                                ${orderDetails?.amount || '0.00'} SGD
                            </span>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                {orderDetails?.items?.length > 0 ? (
                    <div style={styles.card} className="reorder-mobile-card">
                        <h3 style={styles.cardTitle}>Items in This Order ({orderDetails.items.length})</h3>
                        {orderDetails.items.map((item, index) => (
                            <div 
                                key={index} 
                                style={styles.orderItem}
                                className="reorder-mobile-item"
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <img 
                                    src={item.productId?.Image?.[0] || '/placeholder.jpg'} 
                                    alt={item.productId?.productName || 'Product'}
                                    style={styles.orderItemImage}
                                    onError={(e) => {
                                        e.target.src = '/placeholder.jpg';
                                    }}
                                />
                                <div style={styles.itemInfo}>
                                    <h4 style={styles.itemName}>
                                        {item.productId?.productName || item.name || 'Product'}
                                    </h4>
                                    <p style={styles.itemDetails}>
                                        Quantity: {item.quantity || 1}
                                    </p>
                                    <p style={styles.itemPrice}>
                                        ${item.price || '0.00'} × {item.quantity || 1} = ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{...styles.card, ...styles.emptyState}}>
                        <div style={styles.emptyIcon}>📦</div>
                        <p>No items found in this order</p>
                    </div>
                )}

                {/* Shipping Address */}
                {orderDetails?.shippingAddress && (
                    <div style={styles.card} className="reorder-mobile-card">
                        <h3 style={styles.cardTitle}>Previous Shipping Address</h3>
                        <div style={styles.address}>
                            <p style={styles.addressLine}>
                                <strong>📍 {orderDetails.shippingAddress.street}</strong>
                            </p>
                            <p style={styles.addressLine}>
                                {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}
                            </p>
                            <p style={styles.addressLine}>
                                {orderDetails.shippingAddress.zip}
                            </p>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div style={styles.buttonContainer} className="reorder-mobile-buttons">
                    <button 
                        onClick={handleReorder}
                        style={{
                            ...styles.btnPrimary,
                            ...(reordering || !orderDetails?.items?.length ? styles.btnDisabled : {})
                        }}
                        disabled={reordering || !orderDetails?.items?.length}
                        onMouseOver={(e) => {
                            if (!reordering && orderDetails?.items?.length) {
                                e.target.style.transform = 'translateY(-3px)';
                                e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
                            }
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                        }}
                    >
                        {reordering ? '⏳ Adding to Cart...' : '🛒 Add All to Cart'}
                    </button>
                    <button 
                        onClick={() => navigate('/view-order')}
                        style={styles.btnSecondary}
                        onMouseOver={(e) => {
                            e.target.style.background = '#667eea';
                            e.target.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.background = 'white';
                            e.target.style.color = '#667eea';
                        }}
                    >
                        ← Back to Orders
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Reorder;
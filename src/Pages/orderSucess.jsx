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

    // Inline Styles
    const styles = {
        page: {
            padding: '40px 20px',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        },
        container: {
            maxWidth: '900px',
            margin: '0 auto',
            width: '100%',
        },
        successHeader: {
            textAlign: 'center',
            marginBottom: '30px',
            background: 'white',
            padding: '40px 30px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        },
        successIcon: {
            fontSize: '80px',
            marginBottom: '20px',
        },
        successTitle: {
            color: '#28a745',
            marginBottom: '10px',
            fontSize: '32px',
            fontWeight: '700',
        },
        successText: {
            color: '#6c757d',
            fontSize: '18px',
        },
        orderCard: {
            background: 'white',
            padding: '30px',
            marginBottom: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        },
        cardTitle: {
            marginBottom: '20px',
            color: '#2c3e50',
            fontSize: '22px',
            fontWeight: '600',
            borderBottom: '3px solid #007bff',
            paddingBottom: '12px',
        },
        infoRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 0',
            borderBottom: '1px solid #e9ecef',
            fontSize: '16px',
        },
        infoLabel: {
            color: '#6c757d',
            fontWeight: '500',
        },
        infoValue: {
            color: '#2c3e50',
            fontWeight: '600',
            textAlign: 'right',
        },
        statusSuccess: {
            color: '#28a745',
            background: '#d4edda',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '14px',
        },
        total: {
            fontSize: '24px',
            fontWeight: '700',
            color: '#007bff',
        },
        orderItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            padding: '20px',
            border: '1px solid #e9ecef',
            borderRadius: '10px',
            background: '#f8f9fa',
            marginBottom: '15px',
        },
        orderItemImage: {
            width: '90px',
            height: '90px',
            objectFit: 'cover',
            borderRadius: '10px',
            border: '2px solid #dee2e6',
            flexShrink: 0,
        },
        itemInfo: {
            flex: 1,
            minWidth: 0,
        },
        itemTitle: {
            margin: '0 0 10px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#2c3e50',
            wordWrap: 'break-word',
        },
        itemDetails: {
            margin: 0,
            color: '#6c757d',
            fontSize: '15px',
            fontWeight: '500',
        },
        address: {
            margin: '10px 0',
            color: '#495057',
            fontSize: '16px',
            lineHeight: '1.6',
            wordWrap: 'break-word',
        },
        actionButtons: {
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            margin: '40px 0',
            flexWrap: 'wrap',
        },
        btnPrimary: {
            padding: '14px 40px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease',
        },
        btnSecondary: {
            padding: '14px 40px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
            color: 'white',
            boxShadow: '0 4px 15px rgba(108, 117, 125, 0.4)',
            transition: 'all 0.3s ease',
        },
        support: {
            textAlign: 'center',
            marginTop: '30px',
            padding: '20px',
            background: 'white',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        },
        supportText: {
            color: '#6c757d',
            fontSize: '15px',
            margin: 0,
        },
        supportLink: {
            color: '#007bff',
            textDecoration: 'none',
            fontWeight: '600',
        },
        loading: {
            textAlign: 'center',
            padding: '80px 20px',
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        spinner: {
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #007bff',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px',
        },
        loadingText: {
            fontSize: '18px',
            color: '#6c757d',
            fontWeight: '500',
        },
        error: {
            textAlign: 'center',
            padding: '60px 20px',
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            margin: '20px',
        },
        errorTitle: {
            color: '#dc3545',
            marginBottom: '15px',
            fontSize: '28px',
        },
        errorText: {
            color: '#6c757d',
            marginBottom: '30px',
            fontSize: '16px',
        },
    };

    // Add keyframe animation
    const spinnerStyle = document.createElement('style');
    spinnerStyle.innerHTML = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
            .order-item-mobile {
                flex-direction: column !important;
                text-align: center !important;
            }
            .order-item-mobile img {
                width: 80px !important;
                height: 80px !important;
            }
            .action-buttons-mobile {
                flex-direction: column !important;
            }
            .action-buttons-mobile button {
                width: 100% !important;
            }
        }
        
        @media (max-width: 480px) {
            .success-header-mobile h1 {
                font-size: 22px !important;
            }
            .success-icon-mobile {
                font-size: 50px !important;
            }
            .order-item-mobile img {
                width: 70px !important;
                height: 70px !important;
            }
        }
    `;
    document.head.appendChild(spinnerStyle);

    if (loading) {
        return (
            <div style={styles.loading}>
                <div style={styles.spinner}></div>
                <p style={styles.loadingText}>Loading order confirmation...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.error}>
                <h2 style={styles.errorTitle}>Something went wrong</h2>
                <p style={styles.errorText}>{error}</p>
                <button 
                    onClick={() => navigate('/Collections')} 
                    style={styles.btnPrimary}
                    onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                {/* Success Header */}
                <div style={styles.successHeader} className="success-header-mobile">
                    <div style={styles.successIcon} className="success-icon-mobile">✅</div>
                    <h1 style={styles.successTitle}>Order Placed Successfully!</h1>
                    <p style={styles.successText}>Thank you! Your order has been confirmed.</p>
                </div>

                {/* Order Details */}
                <div style={styles.orderCard}>
                    <h3 style={styles.cardTitle}>Order Information</h3>
                    <div>
                        <div style={styles.infoRow}>
                            <span style={styles.infoLabel}>Order Number:</span>
                            <span style={styles.infoValue}>#{orderDetails?.orderId || orderId}</span>
                        </div>
                        <div style={styles.infoRow}>
                            <span style={styles.infoLabel}>Date:</span>
                            <span style={styles.infoValue}>{new Date().toLocaleDateString()}</span>
                        </div>
                        <div style={styles.infoRow}>
                            <span style={styles.infoLabel}>Status:</span>
                            <span style={{...styles.infoValue, ...styles.statusSuccess}}>CONFIRMED</span>
                        </div>
                        <div style={{...styles.infoRow, borderBottom: 'none'}}>
                            <span style={styles.infoLabel}>Total:</span>
                            <span style={{...styles.infoValue, ...styles.total}}>${orderDetails?.amount || '0.00'} SGD</span>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                {orderDetails?.items?.length > 0 && (
                    <div style={styles.orderCard}>
                        <h3 style={styles.cardTitle}>Order Items</h3>
                        {orderDetails.items.map((item, index) => (
                            <div key={index} style={styles.orderItem} className="order-item-mobile">
                                <img 
                                    src={item.productId?.Image?.[0] || '/placeholder.jpg'} 
                                    alt={item.productId?.productName || 'Product'}
                                    style={styles.orderItemImage}
                                    onError={(e) => {
                                        console.error('Image load error:', e.target.src);
                                        e.target.src = '/placeholder.jpg';
                                    }}
                                />
                                <div style={styles.itemInfo}>
                                    <h4 style={styles.itemTitle}>{item.productId?.productName || item.name || 'Product'}</h4>
                                    <p style={styles.itemDetails}>Qty: {item.quantity || 1} × ${item.price || '0.00'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Shipping Address */}
                {orderDetails?.shippingAddress && (
                    <div style={styles.orderCard}>
                        <h3 style={styles.cardTitle}>Shipping Address</h3>
                        <div>
                            <p style={styles.address}>{orderDetails.shippingAddress.street}</p>
                            <p style={styles.address}>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}</p>
                            <p style={styles.address}>{orderDetails.shippingAddress.zip}</p>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div style={styles.actionButtons} className="action-buttons-mobile">
                    <button 
                        onClick={() => navigate('/Collections')}
                        style={styles.btnPrimary}
                        onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                        }}
                    >
                        Continue Shopping
                    </button>
                    <button 
                        onClick={() => navigate('/view-order')}
                        style={styles.btnSecondary}
                        onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(108, 117, 125, 0.6)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(108, 117, 125, 0.4)';
                        }}
                    >
                        View Orders
                    </button>
                </div>

                {/* Support */}
                <div style={styles.support}>
                    <p style={styles.supportText}>
                        Need help? Contact us at <a href="mailto:support@store.com" style={styles.supportLink}>support@store.com</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
import { useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from 'socket.io-client';
import axios from 'axios';

const beUrl = import.meta.env.VITE_BE_URL;

 
// Token is stored in HttpOnly cookie — browser sends it automatically with credentials: 'include'
// Only non-sensitive user identity is kept in localStorage for UI purposes
const gettoken = () => null // kept for compatibility; actual auth uses cookie
const userRegister = async(data) =>{
    try{
    const response = await fetch(`${beUrl}/api/register`,{
        body:JSON.stringify(data),
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        
    })

  const responseData = await response.json();
        if (!response.ok) {
            console.log('Error:', responseData);
            throw new Error(`Error ${response.status}: ${responseData.message}`);
        }

        // Handle verification requirement in response
        if (responseData.requiresVerification) {
            return {
                ...responseData,
                requiresVerification: true,
                message: 'Admin registration successful. Please verify your email to continue.'
            };
        }

        return responseData;
    } catch (error) {
        console.error('Admin registration error:', error);
        throw error;
    }
}


const userLogin = async(data)=>{
    try{
        const response = await fetch(`${beUrl}/api/login`,{
        body:JSON.stringify(data),
        method:'POST',
        credentials: 'include',
        headers:{
            'Content-Type':'application/json',
        },

    })
     const responseData = await response.json();

        // Log response for debugging
        console.log('Login response:', responseData);

        if (!response.ok) {
            if (responseData.requiresVerification) {
                return {
                    requiresVerification: true,
                    message: responseData.message,
                    email: data.email
                };
            }
            throw new Error(responseData.message || 'Login failed');
        }

        return responseData;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}


const AdminLogin = async(data) => {
    try {
        const response = await fetch(`${beUrl}/api/AdminLogin`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        // Log response for debugging
        console.log('Login response:', responseData);

        if (!response.ok) {
            if (responseData.requiresVerification) {
                return {
                    requiresVerification: true,
                    message: responseData.message,
                    email: data.email
                };
            }
            throw new Error(responseData.message || 'Login failed');
        }

        return responseData;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

const AdminRegister = async(data) => {
    try {
        const response = await fetch(`${beUrl}/api/AdminRegister`, {
            body: JSON.stringify(data),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const responseData = await response.json();
        if (!response.ok) {
            console.log('Error:', responseData);
            throw new Error(`Error ${response.status}: ${responseData.message}`);
        }

        // Handle verification requirement in response
        if (responseData.requiresVerification) {
            return {
                ...responseData,
                requiresVerification: true,
                message: 'Admin registration successful. Please verify your email to continue.'
            };
        }

        return responseData;
    } catch (error) {
        console.error('Admin registration error:', error);
        throw error;
    }
}

const profiles = async(data)=>{
    const response = await fetch(`${beUrl}/api/updateprofile`,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body:JSON.stringify(data),
})
const responseData = await response.json();
if (!response.ok) {
    console.log('Error:', responseData);
    throw new Error(`Error ${response.status}: ${responseData.message}`);
}

return responseData;
}


const fetchProducts = async () => {
    try {
        const userId = localStorage.getItem('userID');

        const response = await fetch(`${beUrl}/api/products?adminId=${userId}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch Products Error:', error);
        throw error;
    }
}

const fetchProductsPublic = async () => {
    try {
        const response = await fetch(`${beUrl}/api/public-products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'

            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        return {
            success: true,
            data: data.products,
        };
    } catch (error) {
        console.error('Error fetching products:', error);
        return {
            success: false,
            data: [],
            error: 'Failed to load products'
        };
    }
}
    const editProduct = async(id, updatedData) => {
        const response = await fetch(`${beUrl}/api/edit/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });
        const responseData = await response.json();
        if (!response.ok) {
            console.log('Error:', responseData);
            throw new Error(`Error ${response.status}: ${responseData.message}`);
        }
        return responseData;
    }
    const addProduct = async(Data) => {
    const response = await fetch(`${beUrl}/api/addProducts`, {
        method: 'POST',
        credentials: 'include',
        body: Data
    });

    const responseData = await response.json();
    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('userID');
            throw new Error('Admin session expired. Please log in again.');
        }
        throw new Error(`Error ${response.status}: ${responseData.message || 'Failed to add product'}`);
    }
    return responseData;
}

const deleteProduct = async(id)=>{
    const response = await fetch(`${beUrl}/api/delete/${id}`,{
        method:'DELETE',
        credentials: 'include',
    });
    const responseData = await response.json();
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${responseData.message}`);
    }
    return responseData;
}

const singleProduct = async(id)=>{
    const response = await fetch(`${beUrl}/api/singleProduct/${id}`,{
        method:'GET',
        credentials: 'include',
    });
    const responseData = await response.json();
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${responseData.message}`);
    }
    return responseData;
}

const autoLogout = () => {
    const navigate = useNavigate();
    const logoutTimer = useRef(null);
    const userId = localStorage.getItem('userID');
    useEffect(() => {
        if (userId) {
            const resetLogoutTimer = () => {
                clearTimeout(logoutTimer.current);
                logoutTimer.current = setTimeout(async () => {
                    await fetch(`${beUrl}/api/logout`, { method: 'POST', credentials: 'include' });
                    ['userID', 'Useremail', 'Username', 'userRole'].forEach(k => localStorage.removeItem(k));
                    window.dispatchEvent(new Event('auth-change'));
                    navigate('/login');
                }, 15 * 60 * 1000);
            };

            const events = ['click', 'touchstart', 'mousemove', 'scroll'];
            events.forEach(event => window.addEventListener(event, resetLogoutTimer));
            resetLogoutTimer();

            return () => {
                clearTimeout(logoutTimer.current);
                events.forEach(event => window.removeEventListener(event, resetLogoutTimer));
            };
        }
    }, [userId, navigate]);
}

const reviewProduct = async (id, data) => {
    const response = await fetch(`${beUrl}/api/products/${id}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const responseData = await response.json();
    if (!response.ok) {
        console.log('Error:', responseData);
        throw new Error(`Error ${response.status}: ${responseData.message}`);
    }

    return responseData;
}

const fetchReviews = async (id) => {
    const response = await fetch(`${beUrl}/api/products/${id}/reviews`, {
        method: 'GET',
    });
    const responseData = await response.json();
    if (!response.ok) {
        console.log('Error:', responseData);
        throw new Error(`Error ${response.status}: ${responseData.message}`);
    }

    return responseData;
}

const deleteReview = async (id, name) => {
    const response  = await fetch(`${beUrl}/api/products/${id}/reviews`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
    });
    const responseData = await response.json();
    if (!response.ok) {
        console.log('Error:', responseData);
        throw new Error(`Error ${response.status}: ${responseData.message}`);
    }
    return responseData;
}

const reorderProduct = async (orderId) => {
    const response = await fetch(`${beUrl}/api/payments/reorder/${orderId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
    });

    const responseData = await response.json();
    if (!response.ok) {
        console.log('Error:', responseData);
        throw new Error(`Error ${response.status}: ${responseData.message}`);
    }
    return responseData;
}

const addProductToCart = async (userId, itemId) => {
    const response = await fetch(`${beUrl}/api/cart/add`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, itemId }),
    });

    const responseData = await response.json();
    if (!response.ok) {
        console.log('Error:', responseData);
        throw new Error(`Error ${response.status}: ${responseData.message}`);
    }

    return responseData;
};

const updateCart = async (itemId, quantity) => {
    const userId = localStorage.getItem('userID');
    const response = await fetch(`${beUrl}/api/cart/update/${itemId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, quantity }),
    });

    const responseData = await response.json();
    if (!response.ok) {
        console.log('Error:', responseData);
        throw new Error(`Error ${response.status}: ${responseData.message}`);
    }

    return responseData;
}

const getUserCart = async (userId) => {
    const response = await fetch(`${beUrl}/api/cart?userId=${userId}`, {
        method: 'GET',
        credentials: 'include',
    });

    const responseData = await response.json();
    if (!response.ok) {
        console.log('Error:', responseData);
        throw new Error(`Error ${response.status}: ${responseData.message}`);
    }

    return responseData;
}

const deleteFromCart = async(userId, itemId) =>{
    const response = await fetch(`${beUrl}/api/cart/delete/${itemId}`, {
        method: "DELETE",
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
    });

    const responseData = await response.json();
    if (!response.ok) {
        console.log('Error:', responseData);
        throw new Error(`Error ${response.status}: ${responseData.message}`);
    }

    return responseData;
}

const AddProfile = async (data) =>{
    const response = await fetch(`${beUrl}/api/profile`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    const responseData = await response.json();
    if (!response.ok) {
        console.log('Error:', responseData);
        throw new Error(`Error ${response.status}: ${responseData.message}`);
    }

    return responseData;
}

const fetchUserProfile = async () => {
    const response = await fetch(`${beUrl}/api/userProfile`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
    });

    const responseData = await response.json();
    if (!response.ok) {
        console.log('Error:', responseData);
        throw new Error(`Error ${response.status}: ${responseData.message}`);
    }

    return responseData;
};

const forgotPassword = async (email, isAdmin = false) => {
    try {
        const response = await fetch(`${beUrl}/api/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email,
                isAdmin 
            }),
        });
        
        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.message || 'Failed to process request');
        }

        return {
            ...responseData,
            resetLink: isAdmin ? responseData.adminResetLink : responseData.resetLink
        };
    } catch (error) {
        console.error('Forgot password error:', error);
        throw error;
    }
};

const resetPassword = async(token, newPassword, isAdmin = false) => {
    try {
        const response = await axios.post(`${beUrl}/api/reset-password`, {
            token,
            newPassword,
            isAdmin
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return {
            success: true,
            message: `${isAdmin ? 'Admin' : 'User'} password reset successful`,
            ...response.data
        };
    } catch (error) {
        console.error('Reset password error:', error.response?.data || error.message);
        throw new Error(
            error.response?.data?.message || 
            'Failed to reset password. Please try again.'
        );
    }
}

const verification = async (email, verificationCode, isAdmin = false) => {
    try {
        const response = await axios.post(`${beUrl}/api/verify-login`,
            { email, verificationCode, isAdmin },
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        );

        console.log('Verification response:', response.data);
        
        // If verification code is null, it means we're requesting a new code
        if (!verificationCode && response.data.requiredNewCode) {
            return {
                success: true,
                message: 'New verification code sent to your email'
            };
        }

        return response.data;
    } catch (error) {
        console.error('Verification error:', error.response?.data || error);
        throw error.response?.data || {
            success: false,
            message: verificationCode ? 
                'Failed to verify code. Please try again.' : 
                'Failed to send verification code.'
        };
    }
}

// Fix createPaymentIntent
const createPaymentIntent = async (paymentData) => {
    try {
        const response = await fetch(`${beUrl}/api/payments/create-payment-intent`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData),
        });

        const responseData = await response.json();
        if (!response.ok) {
            console.log('Payment Intent Error:', responseData);
            throw new Error(`Error ${response.status}: ${responseData.message}`);
        }

        return responseData;
    } catch (error) {
        console.error('Create payment intent error:', error);
        throw error;
    }
};

// Fix getPayment
const getPayment = async (orderId) => {
    try {
        const response = await fetch(`${beUrl}/api/payments/payment/${orderId}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });

        const responseData = await response.json();
        if (!response.ok) {
            console.log('Get Payment Error:', responseData);
            throw new Error(`Error ${response.status}: ${responseData.message}`);
        }

        return responseData;
    } catch (error) {
        console.error('Get payment error:', error);
        throw error;
    }
};

// Fix getUserPayments
const getUserPayments = async (userId) => {
    try {
        const response = await fetch(`${beUrl}/api/payments/user/${userId}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });

        const responseData = await response.json();
        if (!response.ok) {
            console.log('Get User Payments Error:', responseData);
            throw new Error(`Error ${response.status}: ${responseData.message}`);
        }

        return responseData;
    } catch (error) {
        console.error('Get user payments error:', error);
        throw error;
    }
}

// Fix refundPayment
const refundPayment = async (refundData) => {
    try {
        const response = await fetch(`${beUrl}/api/payments/refund`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(refundData),
        });

        const responseData = await response.json();
        if (!response.ok) {
            console.log('Refund Error:', responseData);
            throw new Error(`Error ${response.status}: ${responseData.message}`);
        }

        return responseData;
    } catch (error) {
        console.error('Refund payment error:', error);
        throw error;
    }
};

// Fix processPayment
const processPayment = async (cartItems, totalAmount, shippingAddress) => {
    try {
        const userId = localStorage.getItem('userID');

        if (!userId) throw new Error('User not authenticated');

        const response = await fetch(`${beUrl}/api/payments/create-payment-intent`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                amount: parseFloat(totalAmount),
                currency: 'sgd',
                items: cartItems.map(item => ({
                    productId: item.productId || item._id,
                    quantity: item.quantity,
                    price: item.Price || item.price,
                    name: item.productName || item.name
                })),
                shippingAddress
            })
        });

        const responseData = await response.json();
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${responseData.message}`);
        }

        return responseData;
    } catch (error) {
        console.error('Process payment error:', error);
        throw error;
    }
};

// Fix getPaymentStatus
const getPaymentStatus = async (orderId) => {
    try {
        const response = await fetch(`${beUrl}/api/payments/status/${orderId}`, {
            method: 'GET',
            credentials: 'include',
        });

        const responseData = await response.json();
        if (!response.ok) {
            console.log('Get Payment Status Error:', responseData);
            throw new Error(`Error ${response.status}: ${responseData.message}`);
        }

        return responseData;
    } catch (error) {
        console.error('Get payment status error:', error);
        throw error;
    }
};

const confirmPayment = async (paymentIntentId) => {
    try {
        const response = await fetch(`${beUrl}/api/payments/confirm`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentIntentId }),
        });
        const responseData = await response.json();
        if (!response.ok) {
            console.log('Confirm Payment Error:', responseData);
            throw new Error(`Error ${response.status}: ${responseData.message}`);
        }
        return responseData;
    } catch (error) {
        console.error('Confirm payment error:', error);
        throw error;
    }
};

// Fix orderDetails
const orderDetails = async (orderId) => {
    try {
        const response = await fetch(`${beUrl}/api/payments/order-details/${orderId}`, {
            method: 'GET',
            credentials: 'include',
        });

        const responseData = await response.json();
        if (!response.ok) {
            console.log('Get Order Details Error:', responseData);
            throw new Error(`Error ${response.status}: ${responseData.message}`);
        }

        return responseData;
    } catch (error) {
        console.error('Get order details error:', error);
        throw error;
    }
};

// Get all payments for a user (alias for getUserPayments for compatibility)
const getAllPayments = async (userId) => {
    return await getUserPayments(userId);
};

// In Constant.js - Add polling function
const pollPaymentStatus = async (paymentIntentId, maxAttempts = 30) => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            const response = await fetch(`${beUrl}/api/payments/check-status/${paymentIntentId}`, {
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            
            const result = await response.json();
            
            if (result.success && result.paymentStatus !== 'pending') {
                return result;
            }
            
            // Wait 2 seconds before next attempt
            await new Promise(resolve => setTimeout(resolve, 2000));
            
        } catch (error) {
            console.error('Polling error:', error);
        }
    }
    
    throw new Error('Payment status check timeout');
};


const usePaymentStatusListener = (orderId, onStatusUpdate) => {
    useEffect(() => {
        if (!orderId) return;

        const socket = io(import.meta.env.VITE_BE_URL);

        console.log('🔄 Listening for payment updates for order:', orderId);

        // Listen for payment status updates
        socket.on('payment_status_update', (data) => {
            console.log('📨 Payment status update received:', data);
            
            // Check if this update is for our order
            if (data.orderId === orderId || data.transactionId === orderId) {
                console.log('✅ Status update matches our order');
                onStatusUpdate(data.paymentStatus, data.payment);
            }
        });

        // Handle connection events
        socket.on('connect', () => {
            console.log('🔗 Connected to payment status updates');
        });

        // socket.on('disconnect', () => {
        //     console.log('❌ Disconnected from payment status updates');
        // });

        // Cleanup on unmount
        return () => {
            console.log('🧹 Cleaning up socket connection');
            socket.disconnect();
        };
    }, [orderId, onStatusUpdate]);
};

// Direct Purchase Function
const createDirectPurchase = async (purchaseData) => {
    try {
        const response = await fetch(`${beUrl}/api/direct-purchase`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(purchaseData)
        });

        const responseData = await response.json();
        
        if (!response.ok || !responseData.success) {
            throw new Error(responseData.message || 'Failed to create direct purchase');
        }

        return responseData;
    } catch (error) {
        console.error('Create direct purchase error:', error);
        throw error;
    }
};

// Get User Orders Function
const getUserOrderHistory = async () => {
    try {
        const userId = localStorage.getItem('userID');
        if (!userId) throw new Error('Authentication required');

        const response = await fetch(`${beUrl}/api/user-orders?userId=${userId}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        const responseData = await response.json();
        
        if (!response.ok || !responseData.success) {
            throw new Error(responseData.message || 'Failed to fetch orders');
        }

        return responseData;
    } catch (error) {
        console.error('Get orders error:', error);
        throw error;
    }
};

// Export the function
export { userRegister,userLogin,AdminRegister,AdminLogin, profiles, fetchProducts,addProduct,deleteProduct,singleProduct,autoLogout, reviewProduct, fetchReviews, deleteReview, addProductToCart, updateCart, getUserCart, deleteFromCart, fetchProductsPublic,editProduct, AddProfile, fetchUserProfile, forgotPassword, resetPassword, verification,createPaymentIntent, confirmPayment, getPayment, getUserPayments, 
    refundPayment, processPayment, getPaymentStatus, orderDetails, getAllPayments, pollPaymentStatus, reorderProduct,usePaymentStatusListener, createDirectPurchase, getUserOrderHistory };
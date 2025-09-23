import { useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const beUrl = import.meta.env.VITE_BE_URL;

 
const gettoken = () =>{
    return localStorage.getItem('token')
}
const token  = gettoken()
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


const fetchProducts = async()=>{
    const userId = localStorage.getItem('userID');
    const Admintoken = localStorage.getItem('admintoken');
    const response = await fetch(`${beUrl}/api/products?adminId=${userId}`,{
        method:'GET',
        headers:{
            'Authorization': `Bearer ${Admintoken}`,
        }
    })
    const responseData = await response.json();
    if (!response.ok) {
        console.log('Error:', responseData);
        throw new Error(`Error ${response.status}: ${responseData.message}`);
    }
    
    return responseData;
    }

    const fetchProductsPublic = async()=>{
        const Usertoken = localStorage.getItem('UserToken');
        const response = await fetch(`${beUrl}/api/public-products`,{
            method:'GET',
            headers:{
                'Authorization': `Bearer ${Usertoken}`,
            }
        })
        const responseData = await response.json();
        if (!response.ok) {
            console.log('Error:', responseData);
            throw new Error(`Error ${response.status}: ${responseData.message}`);
        }

        return responseData;
    }

    const editProduct = async(id, updatedData) => {
        const Admintoken = localStorage.getItem('admintoken');
        const response = await fetch(`${beUrl}/api/edit/${id}`, {
            method: 'PUT',
            headers: {  
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Admintoken}`,
            },
            body: JSON.stringify(updatedData),
        });
        const responseData = await response.json();
        if (!response.ok) {
            console.log('Error:', responseData);
            throw new Error(`Error ${response.status}: ${responseData.message}`);
        }
        return responseData;
    }
    const addProduct = async(Data)=>{

        
        // if (!token) {
        //     throw new Error('Token not found in localStorage');
        // }
        const Admintoken = localStorage.getItem('admintoken');
        const response = await fetch(`${beUrl}/api/addProducts`,{
            method:'POST',
            headers:{
                'Authorization': `Bearer ${Admintoken}`,
                
                
    },
    body: Data instanceof FormData ? Data : JSON.stringify(Data),
    
})
const responseData = await response.json();
if (!response.ok) {
    console.log('Error:', responseData);
    throw new Error(`Error ${response.status}: ${responseData.message}`);
}


return responseData;

}

const deleteProduct = async(id)=>{
    const tokens = localStorage.getItem('admintoken');
    if (!tokens) {
        throw new Error('Token not found in localStorage');
    }
    const response = await fetch(`${beUrl}/api/delete/${id}`,{
        method:'DELETE',
        headers:{
            Authorization: `Bearer ${tokens}`,

        }
    })
    const responseData = await response.json();
    console.log("Delete API Response:", responseData);
    if (!response.ok) {
        console.log('Error:', responseData);
        throw new Error(`Error ${response.status}: ${responseData.message}`);
    }
    
    return responseData;
}

const singleProduct = async(id)=>{
    if (!token) {
        throw new Error('Token not found in localStorage');
    }
    const response = await fetch(`${beUrl}/api/singleProduct/${id}`,{
        method:'GET',
        headers:{
            Authorization: `Bearer ${token}`,

        }
    })
    const responseData = await response.json();
    console.log("Delete API Response:", responseData);
    if (!response.ok) {
        console.log('Error:', responseData);
        throw new Error(`Error ${response.status}: ${responseData.message}`);
    }
    
    return responseData;
}

const autoLogout = () => {
    const navigate = useNavigate();
    const logoutTimer = useRef(null);
    useEffect(() => {
        if (token) {
            const resetLogoutTimer=()=>{
            logoutTimer.current = setTimeout(() => {
                localStorage.removeItem("UserToken");
                navigate("/login");
                localStorage.removeItem("admintoken");
                navigate("/AdLogin");
            }, 15 * 60 * 1000);
        }
    

        const events = ['click', 'touchstart',  'mousemove', 'scroll'];
        events.forEach(event => 
            window.addEventListener(event, resetLogoutTimer)
        );
        resetLogoutTimer();

        return() =>{
            clearTimeout(logoutTimer.current);
            events.forEach(event => 
                window.removeEventListener(event, resetLogoutTimer)
            );
        }
    }
    }, [token, navigate]);

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
        headers: {  
            Authorization: `Bearer ${token}`,
        },
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



const addProductToCart = async (userId, itemId, Usertoken) => {
    const response = await fetch(`${beUrl}/api/cart/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Usertoken}`,
        },
        body: JSON.stringify({ userId, itemId }),
    });

    const responseData = await response.json();
    if (!response.ok) {
        console.log('Error:', responseData);
        throw new Error(`Error ${response.status}: ${responseData.message}`);
    }

    return responseData;
};

const updateCart = async (itemId, quantity, Usertoken) => {
    const userId = localStorage.getItem('userID');
    const response = await fetch(`${beUrl}/api/cart/update/${itemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Usertoken}`,
        },
        body: JSON.stringify({ userId,quantity }),
    });

    const responseData = await response.json();
    if (!response.ok) {
        console.log('Error:', responseData);
        throw new Error(`Error ${response.status}: ${responseData.message}`);
    }

    return responseData;
}

const getUserCart = async (userId, Usertoken) => {
    const response = await fetch(`${beUrl}/api/cart?userId=${userId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${Usertoken}`,
        },
    });

    const responseData = await response.json();
    if (!response.ok) {
        console.log('Error:', responseData);
        throw new Error(`Error ${response.status}: ${responseData.message}`);
    }

    return responseData;
}

const deleteFromCart = async(userId,itemId,Usertoken) =>{
    
    const response = await fetch(`${beUrl}/api/cart/delete/${itemId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Usertoken}`,
        },
        body: JSON.stringify({ userId }),
        
    });

    const responseData = await response.json();
    if (!response.ok) {
        console.log('Error:', responseData);
        throw new Error(`Error ${response.status}: ${responseData.message}`);
    }

    return responseData;
}

const AddProfile = async (data, Usertoken) =>{
    const response = await fetch(`${beUrl}/api/profile`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Usertoken}`,
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

const fetchUserProfile = async (Usertoken) => {
    const response = await fetch(`${beUrl}/api/userProfile`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${Usertoken}`,
        },
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
        const token = isAdmin ? 
            localStorage.getItem('admintoken') : 
            localStorage.getItem('UserToken');

        const response = await axios.post(`${beUrl}/api/verify-login`, 
            {
                email,
                verificationCode,
                isAdmin
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            }
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



export {userRegister,userLogin,AdminRegister,AdminLogin, profiles, fetchProducts,addProduct,deleteProduct,singleProduct,autoLogout, reviewProduct, fetchReviews, deleteReview, addProductToCart, updateCart, getUserCart, deleteFromCart, fetchProductsPublic,editProduct, AddProfile, fetchUserProfile, forgotPassword, resetPassword, verification};
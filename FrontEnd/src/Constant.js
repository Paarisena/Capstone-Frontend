
import { useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";

const beUrl = import.meta.env.VITE_BE_URL;
const gettoken = () =>{
    return localStorage.getItem('token')
}
const token  = gettoken()
const userRegister = async(data) =>{
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

    return responseData;
}

const userLogin = async(data)=>{
    const response = await fetch(`${beUrl}/api/login`,{
        body:JSON.stringify(data),
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        
    })
    const ResponseData = await response.json();
     if(!response.ok){
        console.log('Error',ResponseData)
        throw new Error(`Error ${response.status}:${ResponseData.message}`) 
     }  
     return ResponseData;
}

const AdminLogin = async(data)=>{
    const response = await fetch(`${beUrl}/api/AdminLogin`,{
        body:JSON.stringify(data),
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        }
})
const ResponseData = await response.json();
     if(!response.ok){
        console.log('Error',ResponseData)
        throw new Error(`Error ${response.status}:${ResponseData.message}`) 
     }  
     return ResponseData;
}

const AdminRegister = async(data)=>{
    const response = await fetch(`${beUrl}/api/AdminRegister`,{
        body:JSON.stringify(data),
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        }
})
const responseData = await response.json();
if (!response.ok) {
    console.log('Error:', responseData);
    throw new Error(`Error ${response.status}: ${responseData.message}`);
}

return responseData;
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
    const response = await fetch(`${beUrl}/api/products`,{
        method:'GET',
        headers:{
            'Authorization': `Bearer ${token}`,
        }
    })
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
        const response = await fetch(`${beUrl}/api/addProducts`,{
            method:'POST',
            headers:{
                'Authorization': `Bearer ${token}`,
                "Cache-Control": "no-cache",
                
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
    if (!token) {
        throw new Error('Token not found in localStorage');
    }
    const response = await fetch(`${beUrl}/api/delete/${id}`,{
        method:'DELETE',
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

const addProductToCart = async (user, id, token) => {
    const response = await fetch(`${beUrl}/api/cart/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
    });

    const responseData = await response.json();
    if (!response.ok) {
        console.log('Error:', responseData);
        throw new Error(`Error ${response.status}: ${responseData.message}`);
    }

    return responseData;
};

const updateCart = async (id, quantity) => {
    const response = await fetch(`${beUrl}/api/cart/update/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
    });

    const responseData = await response.json();
    if (!response.ok) {
        console.log('Error:', responseData);
        throw new Error(`Error ${response.status}: ${responseData.message}`);
    }

    return responseData;
}

const getUserCart = async () => {
    const response = await fetch(`${beUrl}/api/cart`, {
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

export {userRegister,userLogin,AdminRegister,AdminLogin, profiles, fetchProducts,addProduct,deleteProduct,singleProduct,autoLogout, reviewProduct, fetchReviews, deleteReview, addProductToCart, updateCart, getUserCart}
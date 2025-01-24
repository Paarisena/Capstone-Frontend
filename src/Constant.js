const beUrl = import.meta.env.VITE_BE_URL;

const gettoken = () =>{
    return localStorage.getItem('token')
}

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

export {userRegister,userLogin}
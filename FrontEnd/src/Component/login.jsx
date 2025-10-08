import { useState } from "react";
import {Link,Navigate,useNavigate} from "react-router-dom"
import { userLogin } from "../Constant";

import { Button, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const Signin = () => {
  <Link to="/Login">SignIn</Link>
}

function Login(){
    const [Email,SetEmail] = useState("")
    const [password,SetPassword] = useState("")

    const Isloggedin = Boolean(localStorage.getItem('Usertoken'))

    const navigate = useNavigate()

    const handleEmailChange = (e) => {
        SetEmail(e.target.value);
      };
    
      const handlePasswordChange = (e) => {
        SetPassword(e.target.value);
      };

      const handleSubmit = async(e) =>{
        e.preventDefault()
        try{
          const data = await userLogin({email:Email,password:password})
          console.log(data)
           if (data.message === "Login Successful") {
              setTimeout(() => {navigate("/")}, 1000 )
               toast.success('Login Successful');
               }else{
               toast.error('Login Failed')
               }
          const token = data.token;
          localStorage.setItem('Usertoken',token)
          const payload = JSON.parse(atob(token.split('.')[1]));
          if(payload.exp && payload.exp*1000 < Date.now()){
            localStorage.removeItem('Usertoken')
            toast.error('Session expired, please login again')
            navigate('/Login')
            return;
          }
          localStorage.setItem('Username',payload.name)
          console.log(payload.name)
      }catch(err){
          toast.error('Invalid Credentials',err)
      }
    }

      if(Isloggedin){
          return <Navigate to="/"/>
      }

      
    return(
      
        <div className="Register">
            <ToastContainer />
            <h2>ARTVISTA GALLERY</h2>
            <br />
            <form onSubmit={handleSubmit}>
            <div className="mb-1" style={{width:"300px",margin:"auto"}}>
                    <Form.Control value= {Email}
                    name="email"
                    placeholder="Username"
                    onChange={handleEmailChange}
                    required
                    /></div>
                    <br />
                    <div className="password"style={{width:"300px",margin:"auto"}}>
                <Form.Control value={password}
                name="password"
                type="password"
                placeholder="Enter the password"
                onChange={handlePasswordChange}
                required
                />
                <br />
                </div>
                <button type="submit" className="btn btn-primary">
              Login
            </button>
            <Link to="/Register" style={{position:"absolute",right:"51rem"}}>Signup</Link>
            </form>
            </div>
            
    )
  }
  export default Login
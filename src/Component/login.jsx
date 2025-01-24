import { useState } from "react";
import {Link,Navigate,useNavigate} from "react-router-dom"
import { userLogin } from "../Constant";

import { Form } from "react-bootstrap";


function Login(){
    const [Email,SetEmail] = useState("")
    const [password,SetPassword] = useState("")

    const Isloggedin = Boolean(localStorage.getItem('token'))

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
          localStorage.setItem('token',data.token)
          navigate('/')
        }catch(err){
          alert(err.message=='Invalid Credentials')
      }
    }

      if(Isloggedin){
          return <Navigate to="/"/>
      }
    return(
        <div className="Register">
            <h2>ARTVISTA GALLERY</h2>
            <br />
            <form onSubmit={handleSubmit}>
            <div className="mb-1">
                    <Form.Control value= {Email}
                    name="email"
                    placeholder="Username"
                    onChange={handleEmailChange}
                    required
                    /></div>
                    <br />
                    <div className="password">
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
            <Link to="/Register" style={{float:"right"}}>Signup</Link>
            </form>
            </div>
    )
  }
  export default Login
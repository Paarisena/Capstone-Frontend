import { useState } from "react";
import {Link,Navigate,useNavigate} from "react-router-dom"
import { AdminLogin } from "../Constant";
import { Form } from "react-bootstrap";
import { toast,ToastContainer } from "react-toastify";


function AdLogin(){
    const [Email,SetEmail] = useState("")
    const [password,SetPassword] = useState("")

    const Isloggedin = localStorage.getItem('admintoken')

    const navigate = useNavigate()

    const handleEmailChange = (e) => {
        SetEmail(e.target.value);
      };
    
      const handlePasswordChange = (e) => {
        SetPassword(e.target.value);
      };

    const handleSubmitAdmin = async(e)=>{
       e.preventDefault()
       try{
        const data = await AdminLogin({email:Email,password:password})
        localStorage.setItem('admintoken',data.token)
        navigate('/admin/add')
        if(Database.exp && Database.exp < Date.now()){
          localStorage.removeItem('admintoken')
          toast.error('Session expired, please login again')
          navigate('/AdLogin')
        }
       }catch(err){
        alert(err.message===toast.success('Invalid credentials' ? 'Invalid credentials':'Login Failed'))
       }
    }

      if(Isloggedin){
          return <Navigate to="/admin/add"/>
      }

      
    return(
        <div className="Register">
            <ToastContainer />
            <h2>ARTVISTA GALLERY ADMIN PORTAL</h2>
            <br />
            <form onSubmit={handleSubmitAdmin}>
            <div className="mb-1" style={{width:"300px",margin:"auto"}}>
                    <Form.Control value= {Email}
                    name="email"
                    placeholder="Username"
                    onChange={handleEmailChange}
                    required
                    /></div>
                    <br />
                    <div className="password" style={{width:"300px",margin:"auto"}}>
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
            <Link to="/Admin" style={{position:"absolute",right:"51rem"}}>Signup</Link>
            </form>
            </div>
    )
  }
  export default AdLogin
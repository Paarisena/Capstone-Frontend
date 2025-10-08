import {useState} from "react";
import { Form, Button, Col } from "react-bootstrap";
import { Link ,Navigate, useNavigate } from "react-router-dom";
import { userRegister } from "../Constant.js";
import { ToastContainer, toast } from 'react-toastify';

const initialState = {
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
};


// function Registration(){
//     const [name, setName] = useState("")
//     const[email,setEmail] = useState("")
//     const [password, setPassword] = useState("")
//     const[confirmpassword, SetConfirmpassword] = useState("")

const Registration = () =>{
    const[formState, setFormState] = useState(initialState)
    const Isloggedin = Boolean(localStorage.getItem('Usertoken'))
    const navigate = useNavigate()

    const handleChange = (e) =>{
        const {name,value} = e.target;
        setFormState({
            ...formState,
            [name]:value
        })
    }

    const handleSubmit = async(e) =>{
        e.preventDefault()
        try{
            const data = await userRegister(formState)
            if(data.message === toast.success('User registered Succesfully')){
            setFormState(initialState)
            navigate('/login')
            }
        }catch(err){
            alert(err.message === toast.error('User already exists'))
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
                <input 
                value= {formState.name}
                className="form-control"
                name="name"
                id="name"
                type="text"
                placeholder="Username"
                onChange={handleChange}
                required
                /></div>
                <br/>
            <div className="email" style={{width:"300px",margin:"auto"}}>
                <Form.Control value={formState.email}
                type="email"
                name="email"
                placeholder="Enter Email Address"
                onChange={handleChange}
                /></div>
                <br />
            <div className="password" style={{width:"300px",margin:"auto"}}>
                <Form.Control value={formState.password}
                type="password"
                name="password"
                placeholder="Enter the password"
                onChange={handleChange}
                /></div>
                <br/>
            <div className="confirmpassword" style={{width:"300px",margin:"auto"}}>
                <Form.Control value={formState.confirmpassword}
                type="password"
                name="confirmpassword"
                placeholder="Enter confirm password"
                onChange={handleChange}
                /></div>
                <br/>
            
                <button type="Submit" className="btn btn-primary">
                    Register
                </button>
                <Link to='/login' style={{position:"absolute",right:"51rem"}} >
                Signin
                </Link>

        </form>
    </div>
   )
}
export default Registration
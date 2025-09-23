import {useState} from "react";
import { Form, Button, Col, Row, Card } from "react-bootstrap";
import { Link ,Navigate, useNavigate } from "react-router-dom";
import { userRegister } from "../Constant.js";
import { ToastContainer, toast } from 'react-toastify';
import Verification from "./Verification.jsx";

const initialState = {
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
};




const Registration = () =>{
    const [formState, setFormState] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const Isloggedin = Boolean(localStorage.getItem('Usertoken'));
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormState({
            ...formState,
            [name]: value
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        if (formState.password !== formState.confirmpassword) {
            toast.error('Passwords do not match!');
            return;
        }

        setIsLoading(true);
        try {
            const data = await userRegister(formState);
            
            if (data.success) {
                setIsEmailVerified(true);
                toast.info('Please check your email to verify your account', {
                    position: "top-right",
                    autoClose: 5000
                })
            } else {
                toast.error(data.message || 'Registration failed');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerificationSuccess = () => {
            setIsEmailVerified(false);
            setFormState(initialState);
            // Add a slight delay before navigation
            setTimeout(() => {
                toast.success('Email verified successfully! You can now login.');
                navigate('/Login');
            }, 2000);
        };

    if (Isloggedin) {
        return <Navigate to="/" />;
    }

     if (isEmailVerified) {
            return (
                <Verification
                    email={formState.email}
                    isAdmin={false}
                    onVerificationSuccess={handleVerificationSuccess}
                />
            );
        }


   return (
    <>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
        
        <div fluid className="registration-container min-vh-100 d-flex align-items-center justify-content-center py-5">
            <Row className="justify-content-center w-100">
                <Col xs={12} sm={10} md={7} lg={5} xl={4}>
                    <Card className="glass-card border-0 shadow-lg">
                        <Card.Body className="p-4 p-md-5">
                            <div className="text-center mb-4">
                                <h2 className="fw-bold text-primary mb-0">ARTVISTA GALLERY</h2>
                                <p className="text-muted">User Registration</p>
                            </div>

                            <Form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <input 
                                        value={formState.name}
                                        className="glass-input"
                                        name="name"
                                        id="name"
                                        type="text"
                                        placeholder="Username"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <Form.Control 
                                        value={formState.email}
                                        type="email"
                                        name="email"
                                        placeholder="Enter Email Address"
                                        onChange={handleChange}
                                        className="glass-input"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <Form.Control 
                                        value={formState.password}
                                        type="password"
                                        name="password"
                                        placeholder="Enter the password"
                                        onChange={handleChange}
                                        className="glass-input"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <Form.Control 
                                        value={formState.confirmpassword}
                                        type="password"
                                        name="confirmpassword"
                                        placeholder="Enter confirm password"
                                        onChange={handleChange}
                                        className="glass-input"
                                        required
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className="glass-button mb-3"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Registering..." : "Register"}
                                </button>

                                <div className="text-center mt-3">
                                    <span className="text-muted">Already have an account? </span>
                                    <Link to="/login" className="text-primary text-decoration-none">
                                        Sign in
                                    </Link>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <style jsx>{`
                .registration-container {
                    background: linear-gradient(135deg, #ffffff 0%, #f0f2f5 100%);
                    min-height: 100vh;
                    width: 100vw;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: fixed;
                    top: 0;
                    left: 0;
                    transform: none !important;
                }

                .glass-card {
                    background: rgba(255, 255, 255, 0.85);
                    backdrop-filter: blur(20px);
                    border-radius: 1.5rem;
                    box-shadow: 
                        0 8px 32px 0 rgba(31, 38, 135, 0.15),
                        0 2px 4px 0 rgba(31, 38, 135, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.9);
                    transform: none !important;
                    transition: none !important;
                }

                .glass-input {
                    background: rgba(255, 255, 255, 0.9) !important;
                    border: 1px solid rgba(200, 200, 200, 0.5) !important;
                    backdrop-filter: blur(10px);
                    padding: 0.85rem;
                    border-radius: 0.75rem;
                    width: 100%;
                    transition: all 0.2s ease;
                    color: #333;
                }

                .glass-input:focus {
                    background: rgba(255, 255, 255, 1) !important;
                    box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
                    border-color: rgba(13, 110, 253, 0.5) !important;
                }

                .glass-button {
                    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
                    border: none;
                    backdrop-filter: blur(10px);
                    padding: 0.85rem 2rem;
                    border-radius: 0.75rem;
                    color: white;
                    font-weight: 500;
                    width: 100%;
                    transition: all 0.2s ease;
                }

                .glass-button:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
                }

                .glass-button:active {
                    transform: translateY(0);
                }

                h2.text-primary {
                    color: #007bff !important;
                    font-weight: 600;
                    margin-bottom: 2rem;
                }

                .text-muted {
                    color: #6c757d !important;
                }

                .text-primary {
                    color: #007bff !important;
                }

                @media (max-width: 576px) {
                    .glass-card {
                        margin: 1rem;
                        border-radius: 1rem;
                    }

                    .card-body {
                        padding: 1.75rem !important;
                    }
                }
            `}</style>
        </div>
    </>
   )
}
export default Registration
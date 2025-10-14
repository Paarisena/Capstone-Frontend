import { useState } from "react";
import {Link,Navigate,useNavigate} from "react-router-dom"
import { userLogin } from "../Constant";

import { Button, Form, Row, Col, Card } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const Signin = () => {
  <Link to="/Login">SignIn</Link>
}

function Login() {
    const [Email, SetEmail] = useState("");
    const [password, SetPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [needsVerification, setNeedsVerification] = useState(false);
    
    const Isloggedin = Boolean(localStorage.getItem('Usertoken'));
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        SetEmail(e.target.value);
    };
    
    const handlePasswordChange = (e) => {
        SetPassword(e.target.value);
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const data = await userLogin({email: Email, password: password});

            if (data.requiresVerification) {
                setNeedsVerification(true);
                toast.warning('Please verify your email to continue', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                });

                navigate(`/verification/${data.token || 'Usertoken'}`, { 
                    state: { 
                        email: Email,
                        isAdmin: false 
                    }
                });
                return;
            }

            if (data.token) {
                const payload = JSON.parse(atob(data.token.split('.')[1]));
                
                if (payload.exp && payload.exp * 1000 < Date.now()) {
                    localStorage.removeItem('Usertoken');
                    toast.error('Session expired, please login again');
                    return;
                }
                console.log("Login Payload:", payload);

                localStorage.setItem('Usertoken', data.token);
                localStorage.setItem('Useremail', payload.email);
                localStorage.setItem('userID', payload.id);
                localStorage.setItem('Username', payload.name);
                
                
                toast.success('Login successful');
                navigate("/");
            } else {
                toast.error('Invalid credentials');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (Isloggedin) {
        return <Navigate to="/profile"/>;
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            
            <div fluid className="login-container min-vh-100 d-flex align-items-center justify-content-center py-5">
                <Row className="justify-content-center w-100">
                    <Col xs={12} sm={10} md={7} lg={5} xl={4}>
                        <Card className="glass-card border-0 shadow-lg">
                            <Card.Body className="p-4 p-md-5">
                                <h2 className="text-primary mb-4">ARTVISTA GALLERY</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <Form.Control 
                                            value={Email}
                                            name="email"
                                            placeholder="Username"
                                            onChange={handleEmailChange}
                                            required
                                            className="glass-input"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <Form.Control 
                                            value={password}
                                            name="password"
                                            type="password"
                                            placeholder="Enter the password"
                                            onChange={handlePasswordChange}
                                            required
                                            className="glass-input"
                                        />
                                        <div className="forgot-password-container">
                                            <Link to="/forgot-password" className="forgot-password-link">
                                                Forgot Password?
                                            </Link>
                                        </div>
                                    </div>
                                    <Button 
                                        type="submit" 
                                        className="glass-button mb-3"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Logging in..." : "Login"}
                                    </Button>
                                    <div className="text-center mt-3">
                                        <span className="text-muted">Don't have an account? </span>
                                        <Link to="/Register" className="text-primary text-decoration-none">
                                            Sign up
                                        </Link>
                                    </div>
                                </form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>

            <style jsx>{`
                .login-container {
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

                .glass-card:hover {
                    transform: none !important;
                }

                .glass-input {
                    background: rgba(255, 255, 255, 0.9) !important;
                    border: 1px solid rgba(200, 200, 200, 0.5) !important;
                    backdrop-filter: blur(10px);
                    padding: 0.85rem;
                    border-radius: 0.75rem;
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
                    font-weight: 500;
                    width: 100%;
                    border-radius: 0.75rem;
                    transition: all 0.2s ease;
                }

                .glass-button:hover:not(:disabled) {
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

                .forgot-password-container {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 0.5rem;
                }

                .forgot-password-link {
                    color: #007bff;
                    font-size: 0.9rem;
                    text-decoration: none;
                    transition: color 0.2s ease;
                }

                .forgot-password-link:hover {
                    color: #0056b3;
                    text-decoration: underline;
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
        </>
    );
}

export default Login;
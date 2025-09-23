import { useState } from "react";
import { Form, Button, Container, Row, Col, Card, } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AdminRegister } from "../Constant.js";
import { ToastContainer, toast } from 'react-toastify';
import Verification from './Verification';
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
};

const AdminRegistration = () => {
    const [formState, setFormState] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const Isloggedin = Boolean(localStorage.getItem('admintoken'));
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formState.password !== formState.confirmpassword) {
            toast.error('Passwords do not match!');
            return;
        }

        setLoading(true);
        try {
            const data = await AdminRegister(formState);
            
            if (data.success) {
                setIsEmailVerified(true);
                setTimeout(() => {
                    toast.success('Registration successful! Please verify your email.');
                }, 2000);
                // Don't navigate to login yet - wait for verification
                return;
            }
            
            toast.error(data.message || 'Registration failed');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerificationSuccess = () => {
        setIsEmailVerified(false);
        setFormState(initialState);
        // Add a slight delay before navigation
        setTimeout(() => {
            toast.success('Email verified successfully! You can now login.');
            navigate('/AdLogin');
        }, 2000);
    };

    // If already logged in, redirect to admin page
    if (Isloggedin) {
        return <Navigate to="/admin/dashboard" />;
    }

    // Show verification component if verification is needed
    if (isEmailVerified) {
        return (
            <Verification
                email={formState.email}
                isAdmin={true}
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
            
            <div fluid className="admin-registration-container min-vh-100 d-flex align-items-center justify-content-center py-5">
                <Row className="justify-content-center w-100">
                    <Col xs={12} sm={10} md={7} lg={5} xl={4}>
                        <Card className="glass-card border-0 shadow-lg">
                            <Card.Body className="p-4 p-md-5">
                                <div className="text-center mb-4">
                                    <h2 className="fw-bold text-primary mb-0">ARTVISTA GALLERY</h2>
                                    <p className="text-muted">Admin Registration</p>
                                </div>

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            value={formState.name}
                                            name="name"
                                            type="text"
                                            placeholder="Enter username"
                                            onChange={handleChange}
                                            required
                                            className="glass-input"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control
                                            value={formState.email}
                                            type="email"
                                            name="email"
                                            placeholder="Enter email address"
                                            onChange={handleChange}
                                            required
                                            className="glass-input"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            value={formState.password}
                                            type="password"
                                            name="password"
                                            placeholder="Enter password"
                                            onChange={handleChange}
                                            required
                                            className="glass-input"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label>Confirm Password</Form.Label>
                                        <Form.Control
                                            value={formState.confirmpassword}
                                            type="password"
                                            name="confirmpassword"
                                            placeholder="Confirm password"
                                            onChange={handleChange}
                                            required
                                            className="glass-input"
                                        />
                                    </Form.Group>

                                    <div className="d-grid gap-2 mb-3">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            className="glass-button"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Registering...
                                                </>
                                            ) : (
                                                'Register'
                                            )}
                                        </Button>
                                    </div>

                                    <div className="text-center">
                                        <span className="text-muted">Already have an account? </span>
                                        <Link to="/AdLogin" className="text-primary text-decoration-none">
                                            Sign In
                                        </Link>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <style jsx>{`
    .admin-registration-container {
        background: linear-gradient(135deg, #ffffff 0%, #f0f2f5 100%);
        min-height: 100vh;
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed; /* Prevent container from moving */
        top: 0;
        left: 0;
        transform: none !important; /* Force no transform */
    }

    /* Remove hover styles that might cause zoom */
    .admin-registration-container:hover {
        transform: none !important;
    }

    /* Update glass-card to prevent zoom */
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

    /* Prevent zoom on glass-card hover */
    .glass-card:hover {
        transform: none !important;
    }

    .glass-input {
        background: rgba(255, 255, 255, 0.9) !important;
        border: 1px solid rgba(200, 200, 200, 0.5) !important;
        backdrop-filter: blur(10px);
        padding: 0.85rem;
        border-radius: 0.75rem;
        color: #333;
        transition: none;
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
        padding: 0.85rem;
        border-radius: 0.75rem;
        font-weight: 500;
        color: white;
        transition: none;
    }

    .glass-button:hover:not(:disabled) {
        background: linear-gradient(135deg, #0056b3 0%, #004094 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
    }

    .glass-button:disabled {
        background: linear-gradient(135deg, #88c1ff 0%, #5c94d4 100%);
        opacity: 0.7;
    }

    .form-label {
        color: #333;
        font-weight: 500;
        margin-bottom: 0.5rem;
    }

    .text-primary {
        color: #007bff !important;
    }

    .text-muted {
        color: #6c757d !important;
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
    );
};

export default AdminRegistration;
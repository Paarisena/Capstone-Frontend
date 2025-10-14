import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AdminLogin, verification } from "../Constant";
import { Form, Container, Row, Col, Card, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
   const [needsVerification, setNeedsVerification] = useState(false);

  const isLoggedIn = localStorage.getItem('admintoken');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmitAdmin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Attempting admin login...'); // Debug log
      const data = await AdminLogin({ email, password });
      console.log('Login response:', data); // Debug log

      if (data.requiresVerification) {
        setIsEmailVerified(false);
        setNeedsVerification(true);
        
        console.log('Showing verification toast...'); // Debug log
        // Show toast before navigation
        toast.warning('Please verify your email to complete login', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored"
        });

        // Add slight delay before navigation
        setTimeout(() => {
          navigate(`/admin-verification/${data.token || 'admintoken'}`, {
            state: { 
              email, 
              isAdmin: true 
            }
          });
        }, 1000);
        
        return;
      } else if (data.exp && data.exp * 1000 < Date.now()) {
        localStorage.removeItem('admintoken');
        console.log('Showing session expired toast...'); // Debug log
        toast.error('Session expired, please login again', {
          position: "top-right",
          theme: "colored"
        });
      } else if (data.token) {
        localStorage.setItem('admintoken', data.token);
        console.log('Showing success toast...'); // Debug log
        toast.success('Login successful', {
          position: "top-right",
          theme: "colored"
        });
        navigate('/admin/add');
      } else {
        console.log('Showing invalid credentials toast...'); // Debug log
        toast.error('Invalid credentials', {
          position: "top-right",
          theme: "colored"
        });
      }
       
    } catch (err) {
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (err.message && err.message.includes('Too many')) {
        errorMessage = '⏰ Too many login attempts! Please wait 15 minutes.';
        toast.warning(errorMessage, { autoClose: 8000 });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <>
      <Container fluid className="admin-login-container min-vh-100 d-flex align-items-center justify-content-center py-3">
        <Row className="justify-content-center w-100">
          <Col xs={12} sm={10} md={7} lg={5} xl={4}>
            <Card className="glass-card border-0 shadow-lg">
              <Card.Header className="text-center py-3">
              <h3 className="mb-0">ARTVISTA GALLERY</h3>
              <p className="small mb-0">Admin Portal</p>
            </Card.Header>
            
            <Card.Body className="px-4 py-4">
              <Form onSubmit={handleSubmitAdmin}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control 
                    type="email"
                    value={email}
                    name="email"
                    placeholder="Enter email address"
                    onChange={handleEmailChange}
                    required
                    className="glass-input"
                    autoFocus
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <Form.Label>Password</Form.Label>
                    <Link to="/Ad-Forgot-Password" className="text-decoration-none small">
                      Forgot password?  
                    </Link>
                  </div>
                  <Form.Control 
                    type="password"
                    value={password}
                    name="password"
                    placeholder="Enter password"
                    onChange={handlePasswordChange}
                    required
                    className="glass-input"
                  />
                </Form.Group>
                
                <div className="d-grid">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="glass-button"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Logging in...
                      </>
                    ) : (
                      'Login'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
            
            <Card.Footer className="glass-footer text-center px-4 pb-4">
              <p className="mb-0">
                Don't have an admin account?{" "}
                <Link to="/Admin" className="text-decoration-none">
                  Sign up here
                </Link>
              </p>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      
      <style jsx>{`
    .admin-login-container {
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
    .admin-login-container:hover {
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

    .glass-card .card-header {
        background: rgba(255, 255, 255, 0.7) !important;
        border-bottom: 1px solid rgba(13, 110, 253, 0.1);
    }

    .glass-card .card-header h3 {
        color: #007bff;
        font-weight: 600;
    }

    .glass-card .card-header p {
        color: #6c757d;
    }

    .glass-input {
        background: rgba(255, 255, 255, 0.9) !important;
        border: 1px solid rgba(200, 200, 200, 0.5) !important;
        backdrop-filter: blur(10px);
        padding: 0.85rem;
        border-radius: 0.75rem;
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
        padding: 0.85rem;
        border-radius: 0.75rem;
        font-weight: 500;
        color: white;
        transition: all 0.2s ease;
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

    .glass-footer {
        background: rgba(255, 255, 255, 0.7) !important;
        backdrop-filter: blur(10px);
        border-top: 1px solid rgba(13, 110, 253, 0.1) !important;
    }

    .glass-footer a {
        color: #007bff;
        transition: color 0.2s ease;
    }

    .glass-footer a:hover {
        color: #0056b3;
    }

    .form-label {
        color: #333;
        font-weight: 500;
    }

    @media (max-width: 576px) {
        .glass-card {
            margin: 0.5rem;
            border-radius: 1rem;
        }
    }
`}</style>
    </Container>
    </>
  );
}

export default AdLogin;
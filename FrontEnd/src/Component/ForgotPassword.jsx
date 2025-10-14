import { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Container, Row, Col, Card, Button, Alert, InputGroup } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { forgotPassword } from "../Constant";

const ForgotPassword = ({ isAdmin = false }) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [showLink, setShowLink] = useState(false);

  const getLoginPath = () => isAdmin ? "/AdLogin" : "/login";
  const getLoginText = () => isAdmin ? "Admin Login" : "User Login";

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      toast.error("Invalid email address");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setShowLink(false);
    
    try {
      // Pass isAdmin flag to forgotPassword function
      const response = await forgotPassword(email, isAdmin);
      
      if (response.success) {
        setEmailSent(true);
        // Check for admin or user reset link based on isAdmin flag
        if (isAdmin && response.adminResetLink) {
          setResetLink(response.adminResetLink);
          setShowLink(true);
        } else if (!isAdmin && response.resetLink) {
          setResetLink(response.resetLink);
          setShowLink(true);
        }
        toast.success(`${isAdmin ? 'Admin' : 'User'} password reset instructions sent to ${email}`);
      } else {
        setError(response.message || `Failed to process ${isAdmin ? 'admin' : 'user'} reset request`);
        toast.error("Failed to send reset instructions");
      }
    } catch (err) {
      console.error("Password reset request error:", err);
      setError(`Something went wrong while processing ${isAdmin ? 'admin' : 'user'} reset request.`);
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(resetLink)
      .then(() => toast.success(`${isAdmin ? 'Admin' : 'User'} reset link copied to clipboard`))
      .catch(() => toast.error("Failed to copy reset link"));
  };

  return (
    <Container fluid className="forgot-password-container py-5">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={4}>
          <Card className="shadow-lg border-0">
            <Card.Header className={`text-white text-center py-3 ${isAdmin ? 'bg-success' : 'bg-primary'}`}>
              <h3 className="mb-0">ARTVISTA GALLERY</h3>
              <p className="small mb-0">{isAdmin ? 'Admin Password Reset' : 'Password Reset'}</p>
            </Card.Header>
            
            {emailSent ? (
              <Card.Body className="px-4 py-5 text-center">
                <div className="mb-4">
                  <i className="bi bi-envelope-check" style={{ fontSize: "3rem", color: "#0d6efd" }}></i>
                </div>
                <h4 className="mb-3">Check Your Email</h4>
                <p className="mb-4">
                  If the email address <strong>{email}</strong> is registered with us, 
                  you will receive password reset instructions shortly.
                </p>
                <p className="mb-4 text-muted">
                  Please check your inbox and spam folder. The link in the email will expire in 1 hour.
                </p>

                {showLink && (
                  <div className="mb-4">
                    <p className="text-muted mb-2">Your password reset link:</p>
                    <InputGroup className="mb-3">
                      <Form.Control
                        type="text"
                        value={resetLink}
                        readOnly
                        className="bg-light"
                      />
                      <Button 
                        variant="outline-primary" 
                        onClick={handleCopyLink}
                        title="Copy to clipboard"
                      >
                        <i className="bi bi-clipboard"></i>
                      </Button>
                    </InputGroup>
                    <Alert variant="warning" className="text-start mb-4">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      This link will expire in 1 hour for security reasons.
                    </Alert>
                    <Link 
                      to={resetLink} 
                      className="btn btn-primary mb-3"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Reset Link <i className="bi bi-box-arrow-up-right ms-1"></i>
                    </Link>
                  </div>
                )}

                <div className="mt-4 pt-3 border-top">
                  <Link 
                    to={getLoginPath()} 
                    className={`btn btn-outline-${isAdmin ? 'success' : 'primary'} px-4 py-2`}
                  >
                    Return to {isAdmin ? 'Admin Login' : ''} Login
                  </Link>
                </div>
              </Card.Body>
            ) : (
              <Card.Body className="px-4 py-4">
                <p className="text-muted mb-4">
                  Enter your {isAdmin ? 'admin ' : ''}email address below and we'll send you instructions to reset your password.
                </p>
                
                {error && (
                  <Alert variant="danger" className="mb-4">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label>{isAdmin ? 'Admin Email Address' : 'Email Address'}</Form.Label>
                    <Form.Control 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={`Enter your registered ${isAdmin ? 'admin ' : ''}email`}
                      required
                      className="py-2"
                      autoFocus
                      disabled={isSubmitting}
                    />
                    <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </Form.Text>
                  </Form.Group>
                  
                  <div className="d-grid mb-4">
                    <Button 
                      type="submit" 
                      variant={isAdmin ? "success" : "primary"}
                      size="lg"
                      disabled={isSubmitting}
                      className="py-2"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Sending...
                        </>
                      ) : (
                        "Send Reset Instructions"
                      )}
                    </Button>
                  </div>
                  
                  <div className="text-center">
                    <p className="mb-0">
                      Remember your password?{" "}
                      <Link 
                        to={getLoginPath()} 
                        className={`text-decoration-none text-${isAdmin ? 'success' : 'primary'}`}
                      >
                        Back to {getLoginText()}
                      </Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            )}
          </Card>
        </Col>
      </Row>
      
      <style jsx>{`
        .forgot-password-container {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
        }
        
        .card {
          border-radius: 1rem;
        }
        
        .card-header {
          border-top-left-radius: 1rem !important;
          border-top-right-radius: 1rem !important;
        }
        
        .input-group .form-control {
          font-family: monospace;
          font-size: 0.9rem;
        }
        
        .input-group .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .input-group .btn:active {
          transform: translateY(0);
        }
        
        .bg-success {
          background-color: #198754 !important;
        }
        
        .btn-outline-success:hover {
          background-color: #198754;
          color: white;
        }
        
        @media (max-width: 576px) {
          .card {
            border-radius: 0;
            box-shadow: none !important;
            margin: 0;
          }
          
          .forgot-password-container {
            background: #fff;
            padding: 0 !important;
          }
        }
      `}</style>
    </Container>
  );
};

export default ForgotPassword;
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { Form, Container, Row, Col, Card, Button, Alert, InputGroup } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { resetPassword } from "../Constant";
import "react-toastify/dist/ReactToastify.css";

// Modify the component to determine admin status from URL
const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.includes('admin-reset-password');

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (!token) {
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    setPasswordStrength(strength);
  };

  const validatePassword = () => {
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    if (!/[a-z]/.test(newPassword) || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setError("Password must contain lowercase, uppercase letters and numbers");
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  // Add helper functions for path and text
  const getLoginPath = () => isAdmin ? "/AdLogin" : "/login";
  const getLoginText = () => isAdmin ? "Admin Login" : "User Login";

  // Update the handleSubmit function to better handle admin/user scenarios
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      toast.error(error);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await resetPassword(token, newPassword, isAdmin);

      if (response.success) {
        setIsSuccess(true);
        toast.success(`${isAdmin ? 'Admin' : 'User'} password reset successful`);

        // Update redirect path
        setTimeout(() => {
          navigate(getLoginPath());
        }, 3000);
      } else {
        setError(`Failed to reset ${isAdmin ? 'admin' : 'user'} password: ${response.message}`);
        toast.error(`Failed to reset ${isAdmin ? 'admin' : 'user'} password`);
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setError(`Something went wrong while resetting ${isAdmin ? 'admin' : 'user'} password.`);
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container fluid className="reset-password-container py-5">
      <ToastContainer position="top-right" autoClose={3000} />

      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={4}>
          <Card className="shadow-lg border-0">
            <Card.Header className={`text-white text-center py-3 ${isAdmin ? 'bg-success' : 'bg-primary'}`}>
              <h3 className="mb-0">ARTVISTA GALLERY</h3>
              <p className="small mb-0">
                {isAdmin ? 'Admin Password Reset' : 'Create New Password'}
              </p>
            </Card.Header>

            {isSuccess ? (
              <Card.Body className="px-4 py-5 text-center">
                <div className="mb-4">
                  <i className={`bi bi-check-circle-fill text-${isAdmin ? 'success' : 'primary'}`} 
                     style={{ fontSize: "3rem" }}></i>
                </div>
                <h4 className="mb-3">Password Reset Successfully</h4>
                <p className="mb-4">
                  Your {isAdmin ? 'admin ' : ''}password has been reset successfully. 
                  You will be redirected to the {isAdmin ? 'admin ' : ''}login page in a few seconds.
                </p>
                <Link 
                  to={getLoginPath()} 
                  className={`btn btn-${isAdmin ? 'success' : 'primary'} px-4 py-2`}
                >
                  Go to {getLoginText()}
                </Link>
              </Card.Body>
            ) : (
              <Card.Body className="p-4">
                {error && (
                  <Alert variant="danger" className="mb-4">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          checkPasswordStrength(e.target.value);
                        }}
                        placeholder="Enter new password"
                        required
                        className="py-2"
                        autoFocus
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                      </Button>
                    </InputGroup>
                    <div className="mt-2">
                      <div className="password-strength-meter">
                        {[...Array(5)].map((_, index) => (
                          <div
                            key={index}
                            className={`strength-bar ${index < passwordStrength ? 'active' : ''}`}
                          ></div>
                        ))}
                      </div>
                      <small className="text-muted">
                        Password must be at least 8 characters long and contain lowercase, uppercase letters and numbers
                      </small>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Confirm Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                        className="py-2"
                      />
                    </InputGroup>
                  </Form.Group>

                  <div className="d-grid">
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
                          Resetting...
                        </>
                      ) : (
                        `Reset ${isAdmin ? 'Admin ' : ''}Password`
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            )}
          </Card>
        </Col>
      </Row>

      <style jsx>{`
        .reset-password-container {
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

        .password-strength-meter {
          display: flex;
          gap: 5px;
          margin-bottom: 5px;
        }

        .strength-bar {
          height: 4px;
          flex: 1;
          background-color: #e9ecef;
          border-radius: 2px;
          transition: background-color 0.3s ease;
        }

        .strength-bar.active {
          background-color: var(--bs-primary);
        }

        .strength-bar.active:nth-child(1) { background-color: #dc3545; }
        .strength-bar.active:nth-child(2) { background-color: #ffc107; }
        .strength-bar.active:nth-child(3) { background-color: #0dcaf0; }
        .strength-bar.active:nth-child(4) { background-color: #198754; }
        .strength-bar.active:nth-child(5) { background-color: #198754; }

        .bg-success {
          background: linear-gradient(135deg, #198754 0%, #146c43 100%);
        }
        
        .bg-primary {
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
        }
        
        .strength-bar.active:nth-child(4),
        .strength-bar.active:nth-child(5) {
          background-color: ${isAdmin ? '#198754' : '#0d6efd'};
        }

        @media (max-width: 576px) {
          .card {
            border-radius: 0;
            box-shadow: none !important;
            margin: 0;
          }

          .reset-password-container {
            background: #fff;
            padding: 0 !important;
          }
        }
      `}</style>
    </Container>
  );
};

export default ResetPassword;
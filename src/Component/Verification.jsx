import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Container, Row, Col, Card, Button } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import { verification } from "../Constant";
import 'react-toastify/dist/ReactToastify.css';

const Verification = ({ email: initialEmail, isAdmin = false, onVerificationSuccess }) => {
  const location = useLocation();
  const [verificationCode, setVerificationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Set email from props, location state, or empty string
    const emailFromState = location.state?.email;
    setEmail(initialEmail || emailFromState || "");
  }, [initialEmail, location.state]);



  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Email is required");
      toast.error("Please enter your email", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      toast.error("Invalid verification code", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await verification(email, verificationCode, isAdmin);
      
      if (response.success) {
        toast.success(`${isAdmin ? 'Admin' : 'User'} verification successful!`, {
          position: "top-right",
          autoClose: 2000,
        });
        if (onVerificationSuccess) {
          onVerificationSuccess();
        }
        setTimeout(() => {
          navigate(isAdmin ? '/admin/dashboard' : '/profile');
        }, 2000);
      } else {
        setError(response.message || "Verification failed");
        toast.error(response.message || "Verification failed", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError(err.message || "An error occurred during verification");
      toast.error(err.message || "Verification failed", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <>
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <Row className="w-100">
          <Col md={6} className="mx-auto">
            <Card className="shadow">
              <Card.Header className="bg-primary text-white text-center py-3">
                <h4 className="mb-0">
                  {isAdmin ? 'Admin Verification' : 'User Verification'}
                </h4>
              </Card.Header>
              <Card.Body className="p-4">
                <Form onSubmit={handleVerificationSubmit}>
                  <Form.Group controlId="formBasicEmail" className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!!initialEmail || !!location.state?.email}
                        required
                      />
                    </div>
                    <Form.Text className="text-muted">
                      {(!!initialEmail || !!location.state?.email) 
                        ? "Email cannot be changed" 
                        : "Enter your registered email"}
                    </Form.Text>
                  </Form.Group>

                  <Form.Group controlId="formBasicCode" className="mb-4">
                    <Form.Label>Verification Code</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter the 6-digit code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      maxLength={6}
                      isInvalid={!!error}
                      required
                    />
                    <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Please enter the verification code sent to your email
                    </Form.Text>
                  </Form.Group>

                  <Button 
                    variant={isAdmin ? "success" : "primary"}
                    type="submit" 
                    disabled={isSubmitting || !email || verificationCode.length !== 6}
                    className="w-100 mb-3"
                  >
                    {isSubmitting ? "Verifying..." : "Verify Account"}
                  </Button>

                  <div className="text-center">
                    <Button 
                      variant="link" 
                      onClick={() => navigate(isAdmin ? '/AdLogin' : '/Login')}
                      className="text-decoration-none"
                    >
                      Back to {isAdmin ? 'Admin' : 'User'} Login
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );

}
export default Verification;
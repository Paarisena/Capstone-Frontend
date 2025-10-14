import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { EnvelopeFill, TelephoneFill, GeoAltFill, Clock } from "react-bootstrap-icons";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({
      submitted: false,
      submitting: true,
      info: { error: false, msg: null }
    });

    try {
      // Here you would normally send the form data to your backend
      // For now we'll simulate a successful API call
      setTimeout(() => {
        setStatus({
          submitted: true,
          submitting: false,
          info: { error: false, msg: "Thank you for your message. We'll respond shortly!" }
        });
        
        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
      }, 1000);
    } catch (error) {
      setStatus({
        submitted: false,
        submitting: false,
        info: { error: true, msg: "An error occurred. Please try again later." }
      });
    }
  };

  return (
    <div className="contact-page py-5">
      <Container>
        <Row className="justify-content-center mb-5">
          <Col lg={8} md={10}>
            <h1 className="text-center mb-2">Contact Us</h1>
            <p className="text-center text-muted mb-5">
              Have questions about our artwork or need assistance with your order? We're here to help.
            </p>
          </Col>
        </Row>

        <Row className="g-4">
          <Col lg={5} md={6}>
            <Card className="contact-info-card border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <h3 className="contact-section-title mb-4">Get In Touch</h3>

                <div className="contact-item d-flex mb-4">
                  <div className="contact-icon-wrapper me-3">
                    <EnvelopeFill size={20} />
                  </div>
                  <div>
                    <h5 className="contact-item-title">Email</h5>
                    <p className="contact-item-text mb-0">
                      <a href="mailto:info@artvista.com">info@artvista.com</a>
                    </p>
                    <p className="contact-item-text mb-0">
                      <a href="mailto:support@artvista.com">support@artvista.com</a>
                    </p>
                  </div>
                </div>

                <div className="contact-item d-flex mb-4">
                  <div className="contact-icon-wrapper me-3">
                    <TelephoneFill size={20} />
                  </div>
                  <div>
                    <h5 className="contact-item-title">Phone</h5>
                    <p className="contact-item-text mb-0">
                      <a href="tel:+15551234567">(555) 123-4567</a>
                    </p>
                    <p className="contact-item-text mb-0">
                      <a href="tel:+15559876543">(555) 987-6543</a> (Customer Support)
                    </p>
                  </div>
                </div>

                <div className="contact-item d-flex mb-4">
                  <div className="contact-icon-wrapper me-3">
                    <GeoAltFill size={20} />
                  </div>
                  <div>
                    <h5 className="contact-item-title">Gallery Location</h5>
                    <p className="contact-item-text mb-0">
                      123 Art Avenue, Suite 500<br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>

                <div className="contact-item d-flex">
                  <div className="contact-icon-wrapper me-3">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h5 className="contact-item-title">Hours</h5>
                    <p className="contact-item-text mb-0">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={7} md={6}>
            <Card className="contact-form-card border-0 shadow-sm">
              <Card.Body className="p-4">
                <h3 className="contact-section-title mb-4">Send Us a Message</h3>

                {status.info.error && (
                  <Alert variant="danger" className="mb-4">
                    {status.info.msg}
                  </Alert>
                )}

                {status.submitted && (
                  <Alert variant="success" className="mb-4">
                    {status.info.msg}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Your Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Enter your name"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="Enter your email"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Enter subject"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Enter your message"
                    />
                  </Form.Group>

                  <div className="text-end">
                    <Button
                      variant="primary"
                      type="submit"
                      className="px-4 py-2"
                      disabled={status.submitting}
                    >
                      {status.submitting ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="justify-content-center mt-5">
          <Col lg={10}>
            <div className="map-container shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215348544057!2d-73.99387988459475!3d40.75952497932749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b30eac9f%3A0x4170c5cde6596302!2sNew%20York%2C%20NY%2010001!5e0!3m2!1sen!2sus!4v1661171146144!5m2!1sen!2sus"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Art Vista Gallery Location"
              ></iframe>
            </div>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .contact-page {
          background-color: #fcfcfc;
          min-height: 80vh;
        }
        
        h1 {
          font-weight: 600;
          color: #333;
          position: relative;
          padding-bottom: 15px;
        }
        
        h1:after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          background-color: #007bff;
        }
        
        .contact-section-title {
          font-size: 1.4rem;
          color: #333;
          font-weight: 600;
          position: relative;
          padding-bottom: 10px;
        }
        
        .contact-section-title::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          height: 2px;
          width: 40px;
          background-color: #007bff;
        }
        
        .contact-icon-wrapper {
          width: 40px;
          height: 40px;
          min-width: 40px;
          border-radius: 50%;
          background-color: rgba(0, 123, 255, 0.1);
          color: #007bff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .contact-item-title {
          font-size: 1rem;
          font-weight: 600;
          color: #444;
          margin-bottom: 5px;
        }
        
        .contact-item-text {
          color: #666;
          font-size: 0.95rem;
        }
        
        .contact-item-text a {
          color: #666;
          text-decoration: none;
          transition: color 0.2s;
        }
        
        .contact-item-text a:hover {
          color: #007bff;
        }
        
        .map-container {
          border-radius: 8px;
          overflow: hidden;
        }
        
        @media (max-width: 991px) {
          .contact-info-card {
            margin-bottom: 2rem;
          }
        }
        
        @media (max-width: 767px) {
          h1 {
            font-size: 1.8rem;
          }
          
          .contact-section-title {
            font-size: 1.25rem;
          }
          
          .contact-item {
            margin-bottom: 1.5rem;
          }
          
          .contact-item-title {
            font-size: 0.95rem;
          }
          
          .contact-item-text {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;
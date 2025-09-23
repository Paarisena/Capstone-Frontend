import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const ReturnPolicy = () => {
  return (
    <div className="return-policy-page py-5" style={{ position: 'relative', top:'4rem' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} md={10}>
            <h1 className="text-center mb-2">Return & Refund Policy</h1>
            <p className="text-center text-muted mb-5">
              Last updated: August 22, 2025
            </p>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h3 className="policy-section-title">Overview</h3>
                <p>
                  At Art Vista Gallery, we want you to be completely satisfied with your purchase. 
                  We understand that sometimes a piece of art may not look exactly as you envisioned 
                  it in your space. This Return & Refund Policy outlines the process for returning 
                  items purchased through our website.
                </p>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h3 className="policy-section-title">Return Eligibility</h3>
                <p>
                  You may return most new, unopened, or undamaged items within 30 days of delivery for a full refund. 
                  To be eligible for a return, your item must be in the same condition that you received it, 
                  in its original packaging, and with all protective materials intact.
                </p>
                
                <h5 className="policy-subsection-title mt-4">Eligible Items</h5>
                <ul className="policy-list">
                  <li>Standard wall art prints and paintings from our collection</li>
                  <li>Framed artwork with no signs of hanging or display</li>
                  <li>Unopened and undamaged sculpture items</li>
                </ul>
                
                <h5 className="policy-subsection-title mt-4">Non-Eligible Items</h5>
                <ul className="policy-list">
                  <li>Custom or commissioned artwork</li>
                  <li>Limited edition or one-of-a-kind pieces (as indicated in the product description)</li>
                  <li>Items that show signs of use, hanging, or display</li>
                  <li>Items missing original packaging or protective materials</li>
                  <li>Items damaged due to improper handling after delivery</li>
                </ul>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h3 className="policy-section-title">Return Process</h3>
                <p>
                  To initiate a return, please follow these steps:
                </p>
                
                <ol className="policy-list">
                  <li>
                    <strong>Contact Us:</strong> Email our customer service team at returns@artvista.com or call 
                    9994082111 within 14 days of receiving your order to notify us of your intent to return.
                  </li>
                  <li>
                    <strong>Obtain Return Authorization:</strong> Our team will provide you with a Return 
                    Authorization Number (RA#) and specific return instructions.
                  </li>
                  <li>
                    <strong>Package Your Return:</strong> Carefully repackage the artwork in its original 
                    packaging with all protective materials. Include your order number and the RA# provided.
                  </li>
                  <li>
                    <strong>Ship Your Return:</strong> Send your return to the address provided in the return 
                    instructions using a trackable shipping method. We recommend insuring the package for its full value.
                  </li>
                </ol>
                
                <div className="policy-note mt-4">
                  <strong>Note:</strong> You will be responsible for paying the return shipping costs unless the item 
                  arrived damaged or defective. In such cases, please contact our customer service team immediately 
                  before initiating a return.
                </div>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h3 className="policy-section-title">Refund Process</h3>
                <p>
                  Once we receive and inspect your return, we will notify you about the status of your refund.
                </p>
                
                <h5 className="policy-subsection-title mt-4">Approval and Processing</h5>
                <p>
                  If your return is approved, we will initiate a refund to your original payment method. 
                  Depending on your payment provider, it may take 5-10 business days for the refund to appear in your account.
                </p>
                
                <h5 className="policy-subsection-title mt-4">Refund Amount</h5>
                <p>
                  Your refund will include the full purchase price of the item(s). Original shipping costs are 
                  non-refundable unless the return is due to our error (such as sending an incorrect or damaged item).
                </p>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h3 className="policy-section-title">Damaged or Defective Items</h3>
                <p>
                  If you receive a damaged or defective item, please contact us within 48 hours of delivery 
                  with photos of the damage and the packaging. We will work with you to resolve the issue 
                  promptly through replacement or refund.
                </p>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h3 className="policy-section-title">Exchanges</h3>
                <p>
                  We currently do not process direct exchanges. If you wish to exchange an item, please 
                  return the original item following our return process and place a new order for the desired item.
                </p>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h3 className="policy-section-title">Contact Us</h3>
                <p>
                  If you have any questions or concerns about our Return & Refund Policy, please contact our 
                  customer service team:
                </p>
                
                <ul className="policy-contact-list">
                  <li>Email: support@artvista.com</li>
                  <li>Phone: 9994082111</li>
                  <li>Hours: Monday-Friday, 9:00 AM - 5:00 PM EST</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .return-policy-page {
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
        
        .policy-section-title {
          font-size: 1.4rem;
          color: #333;
          font-weight: 600;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #eee;
        }
        
        .policy-subsection-title {
          font-size: 1.1rem;
          color: #444;
          font-weight: 500;
          margin-bottom: 0.75rem;
        }
        
        .policy-list {
          padding-left: 1.25rem;
          margin-bottom: 0;
        }
        
        .policy-list li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
          color: #555;
        }
        
        .policy-list li:last-child {
          margin-bottom: 0;
        }
        
        .policy-note {
          background-color: #f8f9fa;
          border-left: 3px solid #007bff;
          padding: 1rem;
          border-radius: 4px;
          color: #555;
        }
        
        .policy-contact-list {
          list-style: none;
          padding-left: 0;
          margin-top: 1rem;
        }
        
        .policy-contact-list li {
          margin-bottom: 0.5rem;
          color: #555;
        }
        
        @media (max-width: 767px) {
          h1 {
            font-size: 1.8rem;
          }
          
          .policy-section-title {
            font-size: 1.25rem;
          }
          
          .policy-subsection-title {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ReturnPolicy;
import React from "react";
import { Container, Row, Col, Card, Table } from "react-bootstrap";

const ShippingPolicy = () => {
  return (
    <div className="shipping-policy-page py-5 mb-5" style={{ position: 'relative', top:'4rem' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} md={10}>
            <h1 className="text-center mb-2">Shipping Policy</h1>
            <p className="text-center text-muted mb-5">
              Last updated: August 22, 2025
            </p>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h3 className="policy-section-title">Shipping Overview</h3>
                <p>
                  At Art Vista Gallery, we take great care in ensuring your artwork arrives safely and in perfect condition. 
                  We understand that proper packaging and shipping are crucial when handling fine art pieces. This policy 
                  outlines our shipping procedures, timeframes, and costs.
                </p>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h3 className="policy-section-title">Processing Time</h3>
                <p>
                  After your order is placed and payment is confirmed, we carefully prepare your artwork for shipment:
                </p>
                
                <ul className="policy-list">
                  <li>
                    <strong>In-stock items:</strong> Orders are typically processed within 1-2 business days.
                  </li>
                  <li>
                    <strong>Framed artwork:</strong> Please allow 3-5 additional business days for custom framing.
                  </li>
                  <li>
                    <strong>Large or oversized pieces:</strong> May require special handling and additional 1-2 business days.
                  </li>
                  <li>
                    <strong>Custom or commissioned artwork:</strong> Processing times vary based on the project scope and will be communicated during your order confirmation.
                  </li>
                </ul>
                
                <div className="policy-note mt-4">
                  <strong>Note:</strong> During peak seasons (holidays) or promotional periods, processing times may be slightly longer. We will notify you of any significant delays affecting your order.
                </div>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h3 className="policy-section-title">Packaging</h3>
                <p>
                  We take exceptional care in packaging your artwork to ensure it arrives in pristine condition:
                </p>
                
                <ul className="policy-list">
                  <li>All artwork is wrapped in acid-free tissue paper to protect the surface</li>
                  <li>Corner protectors are applied to framed pieces</li>
                  <li>Bubble wrap and foam padding provide cushioning during transit</li>
                  <li>Sturdy cardboard boxes or tubes (for unframed prints) designed specifically for artwork</li>
                  <li>"Fragile" labels are clearly marked on all packages</li>
                </ul>
                
                <p className="mt-3">
                  For oversized or particularly valuable pieces, we may use wooden crates or specialized art shipping containers at our discretion or upon request (additional fees may apply).
                </p>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h3 className="policy-section-title">Shipping Methods & Timeframes</h3>
                <p>
                  We partner with reliable carriers to deliver your artwork safely. Available shipping options include:
                </p>
                
                <Table responsive className="shipping-table mt-3 mb-4">
                  <thead>
                    <tr>
                      <th>Shipping Method</th>
                      <th>Estimated Delivery</th>
                      <th>Tracking</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Standard Shipping</td>
                      <td>5-7 business days</td>
                      <td>Yes</td>
                    </tr>
                    <tr>
                      <td>Expedited Shipping</td>
                      <td>2-3 business days</td>
                      <td>Yes</td>
                    </tr>
                    <tr>
                      <td>Priority Shipping</td>
                      <td>1-2 business days</td>
                      <td>Yes</td>
                    </tr>
                    <tr>
                      <td>White Glove Delivery (for select pieces)</td>
                      <td>By appointment</td>
                      <td>Coordinated delivery</td>
                    </tr>
                  </tbody>
                </Table>
                
                <p>
                  Delivery timeframes are estimates and begin once your order has been processed and shipped. Weather conditions, holidays, and other factors may affect delivery times.
                </p>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h3 className="policy-section-title">Shipping Costs</h3>
                <p>
                  Shipping costs are calculated based on the size, weight, and destination of your order:
                </p>
                
                <ul className="policy-list">
                  <li>
                    <strong>Standard shipping:</strong> Starting at $15 for small pieces, increasing based on size and weight
                  </li>
                  <li>
                    <strong>Expedited shipping:</strong> Starting at $25, varies by size and destination
                  </li>
                  <li>
                    <strong>Priority shipping:</strong> Starting at $40, varies by size and destination
                  </li>
                  <li>
                    <strong>White Glove Delivery:</strong> Starting at $150, quote provided before confirmation
                  </li>
                </ul>
                
                <div className="policy-highlight mt-4">
                  <strong>Free Shipping:</strong> Orders over $250 qualify for free standard shipping within the continental United States (excludes Alaska, Hawaii, and international destinations).
                </div>
                
                <p className="mt-3">
                  Exact shipping costs will be calculated at checkout based on your location and selected shipping method.
                </p>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h3 className="policy-section-title">International Shipping</h3>
                <p>
                  We ship to select international destinations. Please note the following:
                </p>
                
                <ul className="policy-list">
                  <li>International shipping costs are calculated based on destination, size, and weight</li>
                  <li>Delivery typically takes 7-21 business days, depending on the destination</li>
                  <li>Customs duties, taxes, and import fees are the responsibility of the recipient</li>
                  <li>We cannot guarantee transit times once packages enter international shipping networks</li>
                  <li>International orders may require signature confirmation upon delivery</li>
                </ul>
                
                <p className="mt-3">
                  For specific information about shipping to your country, please contact our customer service team before placing your order.
                </p>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h3 className="policy-section-title">Tracking Your Order</h3>
                <p>
                  Once your order ships, you will receive a confirmation email with tracking information. You can also:
                </p>
                
                <ul className="policy-list">
                  <li>Check your order status by logging into your Art Vista Gallery account</li>
                  <li>Contact our customer service team with your order number</li>
                  <li>Use the tracking number provided to monitor your shipment on the carrier's website</li>
                </ul>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h3 className="policy-section-title">Delivery & Acceptance</h3>
                <p>
                  Please note the following regarding delivery:
                </p>
                
                <ul className="policy-list">
                  <li>Some shipments may require signature confirmation upon delivery</li>
                  <li>Please inspect all packages for external damage before signing</li>
                  <li>If the package appears damaged, note this on the delivery receipt</li>
                  <li>We recommend opening and inspecting your artwork within 48 hours of delivery</li>
                  <li>Notify us immediately of any issues or damages by contacting our customer service team</li>
                </ul>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h3 className="policy-section-title">Contact Us</h3>
                <p>
                  If you have questions about shipping or need assistance with tracking your order, please contact our customer service team:
                </p>
                
                <ul className="policy-contact-list">
                  <li>Email: shipping@artvista.com</li>
                  <li>Phone: (555) 123-4567</li>
                  <li>Hours: Monday-Friday, 9:00 AM - 5:00 PM EST</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .shipping-policy-page {
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
        
        .policy-highlight {
          background-color: #e8f4ff;
          padding: 1rem;
          border-radius: 4px;
          color: #0056b3;
        }
        
        .shipping-table {
          border-collapse: separate;
          border-spacing: 0;
        }
        
        .shipping-table th {
          background-color: #f8f9fa;
          border-bottom: 2px solid #dee2e6;
          color: #444;
        }
        
        .shipping-table td, .shipping-table th {
          padding: 0.75rem;
          vertical-align: middle;
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
          
          .shipping-table {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ShippingPolicy;
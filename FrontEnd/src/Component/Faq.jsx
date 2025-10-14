import React, { useState } from "react";
import { Container, Row, Col, Accordion, Card } from "react-bootstrap";

const Faq = () => {
  const [activeKey, setActiveKey] = useState("0");
  
  const handleAccordionToggle = (eventKey) => {
    setActiveKey(activeKey === eventKey ? null : eventKey);
  };

  const faqItems = [
    {
      question: "What types of art does Art Vista Gallery offer?",
      answer: "Art Vista Gallery specializes in three distinctive styles of wall art: Wabi-Sabi (celebrating the beauty of imperfection), Abstract (expressive and emotional pieces), and Minimalist (clean, simple designs). Our curated collection includes paintings, prints, and mixed media pieces that cater to different aesthetic preferences."
    },
    {
      question: "How do I know which size artwork is right for my space?",
      answer: "When selecting artwork, consider the wall space where you plan to display it. As a general rule, artwork should occupy about 2/3 to 3/4 of the available wall space. For living rooms, larger pieces (24\" x 36\" or larger) often work well, while smaller spaces like hallways might benefit from medium-sized works (16\" x 20\"). We provide dimensions for all our pieces to help you make the best choice."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept major credit and debit cards (Visa, Mastercard, American Express, Discover), PayPal, and digital wallets. All transactions are processed securely through our payment gateway to ensure your financial information remains protected."
    },
    {
      question: "How is the artwork packaged and shipped?",
      answer: "We take great care in packaging your artwork to ensure it arrives in perfect condition. Each piece is wrapped in acid-free tissue paper, secured with corner protectors, and placed in a sturdy cardboard box with additional padding. We ship nationwide via reliable carriers with tracking information provided for all orders."
    },
    {
      question: "What is your return policy?",
      answer: "We want you to be completely satisfied with your purchase. If you're not happy with your artwork, you can return it within 30 days of delivery in its original condition and packaging for a full refund. Custom or commissioned pieces are non-refundable. Please refer to our Return & Refund Policy page for detailed instructions on initiating a return."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Currently, we ship within the United States and select international destinations. International shipping costs and delivery times vary depending on the destination. Please contact our customer service team for specific information regarding international orders."
    },
    {
      question: "How do I care for my artwork?",
      answer: "To preserve your artwork, display it away from direct sunlight, heat sources, and high humidity areas. Clean framed pieces gently with a soft, dry cloth. For unframed canvas, dust lightly with a soft brush. Avoid using cleaning products directly on the artwork as they may damage the surface."
    },
    {
      question: "Do you offer custom or commissioned artwork?",
      answer: "Yes, we work with our roster of artists to create custom pieces tailored to your specific preferences and space requirements. For custom commissions, please contact us with details about your vision, desired dimensions, color palette, and budget. We'll connect you with suitable artists who can bring your idea to life."
    },
    {
      question: "How do I create an account on your website?",
      answer: "Creating an account is simple. Click on the 'Register' link in the top navigation bar, fill in your details, and submit the form. Having an account allows you to track orders, save favorite artworks, and receive personalized recommendations based on your preferences."
    },
    {
      question: "Are the colors in the online images true to the actual artwork?",
      answer: "We make every effort to accurately represent our artwork online. However, slight variations may occur due to differences in screen calibration and lighting conditions. Each product page includes detailed information about colors and textures to help you make an informed decision."
    }
  ];

  return (
    <div className="faq-page py-5" style={{ position: 'relative', top:'4rem' }}>
      <Container>
        <Row className="justify-content-center mb-5">
          <Col lg={8} md={10}>
            <h1 className="text-center mb-2">Frequently Asked Questions</h1>
            <p className="text-center text-muted mb-5">
              Find answers to common questions about our artwork, ordering, shipping, and more.
            </p>

            <Accordion defaultActiveKey="0" className="faq-accordion">
              {faqItems.map((item, index) => (
                <Card key={index} className="mb-3 border-0 shadow-sm">
                  <Accordion.Item eventKey={index.toString()}>
                    <Accordion.Header 
                      onClick={() => handleAccordionToggle(index.toString())}
                      className="faq-header"
                    >
                      {item.question}
                    </Accordion.Header>
                    <Accordion.Body className="faq-body">
                      {item.answer}
                    </Accordion.Body>
                  </Accordion.Item>
                </Card>
              ))}
            </Accordion>

            <div className="text-center mt-5">
              <p className="mb-2">Can't find what you're looking for?</p>
              <a href="/contact" className="btn btn-outline-primary">
                Contact Our Support Team
              </a>
            </div>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .faq-page {
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

        .faq-accordion .accordion-button {
          background-color: white;
          color: #333;
          font-weight: 500;
          padding: 1rem 1.25rem;
          box-shadow: none;
          border-left: 3px solid transparent;
        }
        
        .faq-accordion .accordion-button:not(.collapsed) {
          background-color: white;
          color: #007bff;
          border-left: 3px solid #007bff;
        }
        
        .faq-accordion .accordion-button:focus {
          box-shadow: none;
          border-color: rgba(0,123,255, 0.25);
        }
        
        .faq-accordion .accordion-button::after {
          background-size: 1.25rem;
          transition: all 0.2s ease;
        }
        
        .faq-accordion .accordion-body {
          padding: 1rem 1.25rem 1.5rem;
          color: #666;
          line-height: 1.6;
        }
        
        @media (max-width: 767px) {
          h1 {
            font-size: 1.8rem;
          }
          
          .faq-accordion .accordion-button {
            font-size: 0.95rem;
            padding: 0.875rem 1rem;
          }
          
          .faq-accordion .accordion-body {
            font-size: 0.9rem;
            padding: 0.875rem 1rem 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Faq;
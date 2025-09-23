import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const About = () => {
    return (
        <div className="about-page py-5">
            <Container>
                <Row className="justify-content-center mb-5">
                    <Col lg={8} md={10}>
                        <h1 className="text-center mb-4">About Art Vista Gallery</h1>
                        <div className="about-content">
                            <p className="lead text-center mb-5">
                                Curating exceptional wall art that transforms spaces and inspires moments of reflection.
                            </p>
                            
                            <h3 className="mb-3">Our Vision</h3>
                            <p>
                                At Art Vista Gallery, we believe that art is more than decoration—it's a powerful medium 
                                that shapes our experiences and environments. Established with a passion for curating distinctive 
                                wall art, we specialize in three distinctive styles that speak to different aesthetic sensibilities: 
                                the harmonious imperfection of Wabi-Sabi, the emotional depth of Abstract, and the elegant simplicity 
                                of Minimalist art.
                            </p>
                            
                            <h3 className="mb-3 mt-4">Our Collection</h3>
                            <p>
                                Each piece in our carefully selected collection is chosen for its ability to transform spaces 
                                and create meaningful connections. From the embracing of natural imperfection in our Wabi-Sabi 
                                collection to the bold expressions in our Abstract pieces and the refined restraint of our 
                                Minimalist works, we offer art that resonates with diverse tastes and interior styles.
                            </p>
                            
                            <h3 className="mb-3 mt-4">Our Commitment</h3>
                            <p>
                                We are committed to making exceptional art accessible. Our online gallery experience 
                                allows art enthusiasts to explore our collections at their convenience, with detailed 
                                product information and high-quality images that showcase each piece's unique character. 
                                We believe that finding the perfect artwork should be an inspiring journey, not a 
                                complicated process.
                            </p>
                            
                            <h3 className="mb-3 mt-4">Customer Experience</h3>
                            <p>
                                When you purchase from Art Vista Gallery, you're not just buying art—you're investing in 
                                an experience. Our secure shopping platform makes it easy to discover, select, and purchase 
                                pieces that speak to you. We value the feedback from our community of art lovers, which 
                                is why we encourage reviews and open dialogue about the works we offer.
                            </p>
                            
                            <div className="text-center mt-5">
                                <p className="mb-0 font-italic">
                                    "Art enables us to find ourselves and lose ourselves at the same time."
                                </p>
                                <p className="text-muted">— Thomas Merton</p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            
            <style jsx>{`
                .about-page {
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
                
                h3 {
                    font-weight: 500;
                    color: #444;
                }
                
                .lead {
                    font-size: 1.25rem;
                    font-weight: 300;
                    color: #555;
                }
                
                .about-content p {
                    line-height: 1.7;
                    color: #666;
                }
                
                .font-italic {
                    font-style: italic;
                    font-size: 1.15rem;
                }
                
                @media (max-width: 767px) {
                    h1 {
                        font-size: 1.8rem;
                    }
                    
                    .lead {
                        font-size: 1.1rem;
                    }
                    
                    h3 {
                        font-size: 1.3rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default About;
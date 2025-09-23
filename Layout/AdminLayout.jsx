import React from "react";
import { Row, Container,Col } from "react-bootstrap";
import Sidebar from "../NavBar/Sidebar";

const AdminLayout = ({ children }) => {
    return (
        <Container fluid>
            <Row>
                
                    <Sidebar />
                

                {/* Main Content */}
                <Col md={11}>
                    <div className="p-4">{children}</div>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminLayout; 
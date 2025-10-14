import { AddProfile, fetchUserProfile } from "../Constant";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";

const Profile = () => {
    const [profileData, setProfileData] = useState({
        name: localStorage.getItem("Username") || "",
        email: localStorage.getItem("Useremail") || "",
        DOB: "",
        phone: "",
        address: {
            street: "",
            city: "",
            state: "",
            zip: ""
        }
    });


    
    const navigate = useNavigate();
    const [selectedState, setSelectedState] = useState(profileData.address?.state || "");
    
    // List of Indian states
    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
        "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
        "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
        "Uttarakhand", "West Bengal"
    ];
    
    // Districts in Tamil Nadu
    const tamilNaduDistricts = [
        "Ariyalur", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", 
        "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Nagapattinam", 
        "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Salem", 
        "Sivaganga", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", 
        "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", 
        "Virudhunagar"
    ];

    const fetchProfileData = async () => {
        try {
            const Usertoken = localStorage.getItem("Usertoken");
            const response = await fetchUserProfile(Usertoken);
            if (response.success) {
                setProfileData(response.profile);
                setSelectedState(response.profile.address?.state || "");
            } else {
                console.log("Error fetching profile data:", response.message);
            }
        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    const handleProfileUpdate = async () => {
        try {
            const response = await AddProfile(profileData, localStorage.getItem("Usertoken"));
            console.log("Profile updated successfully:", response);

            if (profileData.address?.street) {
            localStorage.setItem("Address", profileData.address.street);
            localStorage.setItem("City", profileData.address.city);
            localStorage.setItem("State", profileData.address.state);
            localStorage.setItem("PostalCode", profileData.address.zip);
        }
            navigate("/profile");
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };


    return (
        <Container className="py-4">
            <Card className="profile-card shadow-sm">
                <Card.Body>
                    <h2 className="text-center mb-4">Your Profile</h2>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formBasicName">
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your name"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Date of Birth</Form.Label>
                                    <Form.Control
                                        type="date"
                                        placeholder="DD/MM/YYYY"
                                        value={profileData.DOB || ""}
                                        onChange={(e) => setProfileData({ ...profileData, DOB: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formBasicPhone">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        value={profileData.phone || ""}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <h4 className="mt-4 mb-3">Address Information</h4>
                        
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3" controlId="formBasicStreet">
                                    <Form.Label>Street Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Street address"
                                        value={profileData.address?.street || ""}
                                        onChange={e => setProfileData({
                                            ...profileData,
                                            address: { ...profileData.address, street: e.target.value }
                                        })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formBasicState">
                                    <Form.Label>State</Form.Label>
                                    <Form.Select
                                        value={selectedState}
                                        onChange={e => {
                                            setSelectedState(e.target.value);
                                            setProfileData({
                                                ...profileData,
                                                address: { ...profileData.address, state: e.target.value }
                                            });
                                        }}
                                    >
                                        <option value="">Select State</option>
                                        {indianStates.map((state, index) => (
                                            <option key={index} value={state}>{state}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formBasicCity">
                                    <Form.Label>City/District</Form.Label>
                                    {selectedState === "Tamil Nadu" ? (
                                        <Form.Select
                                            value={profileData.address?.city || ""}
                                            onChange={e => setProfileData({
                                                ...profileData,
                                                address: { ...profileData.address, city: e.target.value }
                                            })}
                                        >
                                            <option value="">Select District</option>
                                            {tamilNaduDistricts.map((district, index) => (
                                                <option key={index} value={district}>{district}</option>
                                            ))}
                                        </Form.Select>
                                    ) : (
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter city/district"
                                            value={profileData.address?.city || ""}
                                            onChange={e => setProfileData({
                                                ...profileData,
                                                address: { ...profileData.address, city: e.target.value }
                                            })}
                                        />
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-4" controlId="formBasicZip">
                                    <Form.Label>Postal Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter postal code"
                                        value={profileData.address?.zip || ""}
                                        onChange={e => setProfileData({
                                            ...profileData,
                                            address: { ...profileData.address, zip: e.target.value }
                                        })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="text-center mt-3">
                            <Button 
                                variant="primary" 
                                size="lg" 
                                onClick={handleProfileUpdate} 
                                className="profile-update-btn"
                            >
                                Update Profile
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            <style jsx>{`
                .profile-card {
                    max-width: 900px;
                    margin: 0 auto;
                    border-radius: 10px;
                    border: none;
                }
                
                .profile-update-btn {
                    padding: 10px 40px;
                    font-weight: 500;
                    border-radius: 5px;
                    transition: all 0.3s ease;
                }
                
                .profile-update-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                
                @media (max-width: 768px) {
                    .profile-card {
                        padding: 10px;
                    }
                    
                    h2 {
                        font-size: 1.5rem;
                    }
                    
                    h4 {
                        font-size: 1.2rem;
                    }
                }
            `}</style>
        </Container>
    );
};

export default Profile;
import { useState, useContext, useEffect } from 'react';
import { Form, Button, Col, Row, Card } from 'react-bootstrap';
import { addProduct } from '../Constant';
import { toast, ToastContainer } from 'react-toastify';
import './dashboard.css';

import { 
  PlusCircleFill, 
  FileEarmarkText, 
  Tag, 
  CurrencyDollar,
  Images,
  XCircle
} from 'react-bootstrap-icons';

const AddProd = () => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("1");
  const [imageNames, setImageNames] = useState({1: '', 2: '', 3: '', 4: ''});
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(250);
  
  // Check for sidebar width changes
  useEffect(() => {
    const checkSidebarWidth = () => {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        setSidebarWidth(sidebar.offsetWidth);
      }
    };
    
    checkSidebarWidth();
    window.addEventListener('resize', checkSidebarWidth);
    
    // Also check when clicking the collapse button might change sidebar width
    const collapseBtn = document.querySelector('.collapse-btn');
    if (collapseBtn) {
      collapseBtn.addEventListener('click', () => {
        // Small delay to let transition complete
        setTimeout(checkSidebarWidth, 300);
      });
    }
    
    return () => {
      window.removeEventListener('resize', checkSidebarWidth);
    };
  }, []);

  const handleImageChange = (e, imageNumber) => {
    const file = e.target.files[0];
    if (file) {
      switch (imageNumber) {
        case 1: setImage1(file); break;
        case 2: setImage2(file); break;
        case 3: setImage3(file); break;
        case 4: setImage4(file); break;
        default: break;
      }
      setImageNames({...imageNames, [imageNumber]: file.name});
    }
  };

  const clearImage = (imageNumber) => {
    switch (imageNumber) {
      case 1: setImage1(null); break;
      case 2: setImage2(null); break;
      case 3: setImage3(null); break;
      case 4: setImage4(null); break;
      default: break;
    }
    setImageNames({...imageNames, [imageNumber]: ''});
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const adminId = localStorage.getItem('userID');
      const formData = new FormData();
      formData.append('productName', name);
      formData.append('productDescription', description);
      formData.append('Price', price);
      formData.append("Category", category);

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);
      
      const response = await addProduct(formData);
      
      if (response) {
        toast.success('Product Added Successfully');
        setName('');
        setDescription('');
        setCategory('1');
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
        setImageNames({1: '', 2: '', 3: '', 4: ''});
        setPrice('');
      } else {
        toast.error('Failed to add product');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error adding product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="content-wrapper" 
      style={{ marginLeft: `${sidebarWidth}px` }}
    >
      <div className="glass-card">
        <Form onSubmit={handleProductSubmit}>
          <h2 className="mb-4 product-title">
            <PlusCircleFill className="me-2 text-primary" size={28} />
            Add New Product
          </h2>
          
          <Row className="mb-4">
            <Col lg={6} md={12} className="mb-4">
              <Form.Group controlId="productName">
                <Form.Label className="fw-bold form-label">
                  <FileEarmarkText className="me-2" /> Product Name
                </Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Enter product name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  size="lg"
                />
              </Form.Group>
            </Col>
            
            <Col lg={6} md={12} className="mb-4">
              <Form.Group controlId="productCategory">
                <Form.Label className="fw-bold form-label">
                  <Tag className="me-2" /> Category
                </Form.Label>
                <Form.Select
                  aria-label="Select category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-input"
                  size="lg"
                >
                  <option value="1">Wabi Sabi Wall Art</option>
                  <option value="2">Abstract Wall Art</option>
                  <option value="3">3D Minimalist Wall Art</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mb-4">
            <Col lg={6} md={12} className="mb-4">
              <Form.Group controlId="productPrice">
                <Form.Label className="fw-bold form-label">
                  <CurrencyDollar className="me-2" size={20} /> Price
                </Form.Label>
                <Form.Control
                  required
                  type="number"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="form-input"
                  size="lg"
                />
              </Form.Group>
            </Col>
            
            <Col lg={6} md={12} className="mb-4">
              <Form.Group controlId="productDescription">
                <Form.Label className="fw-bold form-label">
                  <FileEarmarkText className="me-2" /> Description
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Enter product description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-input"
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mb-5">
            <Col xs={12}>
              <Form.Label className="fw-bold form-label mb-3">
                <Images className="me-2" size={20} /> Product Images
              </Form.Label>
              <div className="image-upload-container">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="image-upload-box mb-3">
                    <input
                      type="file"
                      id={`image${num}`}
                      onChange={(e) => handleImageChange(e, num)}
                      className="d-none"
                      accept="image/*"
                    />
                    <label htmlFor={`image${num}`} className="upload-label">
                      {imageNames[num] ? (
                        <div className="file-name-container">
                          <span className="file-name">{imageNames[num]}</span>
                          <Button 
                            variant="link" 
                            className="clear-btn" 
                            onClick={(e) => {
                              e.preventDefault();
                              clearImage(num);
                            }}
                          >
                            <XCircle size={20} />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Images size={24} />
                          <span className="ms-2">Choose Image {num}</span>
                        </>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
          
          <div className="d-flex justify-content-end">
            <Button 
              type="submit" 
              variant="primary" 
              className="submit-btn"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? 'Adding...' : 'Add Product'}
            </Button>
          </div>
        </Form>
      </div>
      <ToastContainer position="bottom-right" />
      
      <style jsx>{`
    .content-wrapper {
        background: linear-gradient(135deg, #ffffff 0%, #f0f2f5 100%);
        min-height: 90vh;
        width: calc(95vw - ${sidebarWidth}px);
        transition: all 0.3s ease;
        max-width: 1800px;
        margin: 0 auto;
        padding: 2rem;
    }

    .glass-card {
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(20px);
        border-radius: 1.5rem;
        box-shadow: 
            0 8px 32px 0 rgba(31, 38, 135, 0.15),
            0 2px 4px 0 rgba(31, 38, 135, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.9);
        padding: 2.5rem;
    }

    .product-title {
        font-size: 2rem;
        font-weight: 600;
        color: #333;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .form-label {
        font-size: 1.1rem;
        margin-bottom: 0.75rem;
        color: #333;
        font-weight: 500;
    }

    .form-input {
        background: rgba(255, 255, 255, 0.9) !important;
        border: 1px solid rgba(200, 200, 200, 0.5) !important;
        backdrop-filter: blur(10px);
        border-radius: 0.75rem;
        padding: 0.85rem 1rem;
        color: #333;
        transition: all 0.2s ease;
    }

    .form-input:focus {
        background: rgba(255, 255, 255, 1) !important;
        box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
        border-color: rgba(13, 110, 253, 0.5) !important;
    }

    .submit-btn {
        background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
        border: none;
        backdrop-filter: blur(10px);
        padding: 0.85rem 2rem;
        border-radius: 0.75rem;
        font-weight: 500;
        color: white;
        transition: all 0.2s ease;
    }

    .submit-btn:hover:not(:disabled) {
        background: linear-gradient(135deg, #0056b3 0%, #004094 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
    }

    .submit-btn:disabled {
        background: linear-gradient(135deg, #88c1ff 0%, #5c94d4 100%);
        opacity: 0.7;
    }

    .image-upload-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        grid-gap: 20px;
    }

    .upload-label {
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        border: 2px dashed rgba(13, 110, 253, 0.2);
        border-radius: 0.75rem;
        padding: 1.25rem;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s ease;
        height: 100%;
        min-height: 90px;
        font-size: 1.05rem;
        color: #333;
    }

    .upload-label:hover {
        background: rgba(255, 255, 255, 1);
        border-color: rgba(13, 110, 253, 0.4);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 123, 255, 0.1);
    }

    .file-name-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        background: rgba(255, 255, 255, 0.95);
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
    }

    .file-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 220px;
        font-size: 1rem;
        color: #333;
    }

    .clear-btn {
        color: #dc3545;
        padding: 0;
        transition: all 0.2s ease;
    }

    .clear-btn:hover {
        color: #c82333;
        transform: scale(1.1);
    }

    /* Keep your existing media queries with updated backgrounds */
    @media (max-width: 992px) {
      .content-wrapper {
        /* At this breakpoint sidebar is 70px */
        width: calc(100% - 70px);
      }
    }
    
    @media (max-width: 767px) {
      .image-upload-container {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .product-title {
        font-size: 1.7rem;
      }
      
      .file-name {
        max-width: 150px;
      }
    }
    
    @media (max-width: 576px) {
      .content-wrapper {
        /* At smallest screens, sidebar is collapsed to 0 initially */
        width: 100%;
        margin-left: 0;
        padding-left: 10px;
        padding-right: 10px;
      }
      
      .image-upload-container {
        grid-template-columns: 1fr;
      }
      
      .upload-label {
        min-height: 70px;
      }
      
      .product-title {
        font-size: 1.5rem;
      }
    }
    
    /* Larger screens */
    @media (min-width: 1400px) {
      .content-wrapper {
        padding-left: 40px;
        padding-right: 40px;
      }
    }
  `}</style>
    </div>
  );
};

export default AddProd;
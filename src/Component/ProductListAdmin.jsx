import React, { useEffect, useState } from "react";
import { fetchProducts, deleteProduct, editProduct } from "../Constant";
import { Card, Row, Col, Table, Button, Form, Badge, Spinner, InputGroup } from "react-bootstrap";
import { toast, ToastContainer } from 'react-toastify';
import { PencilFill, TrashFill, XCircleFill, CheckCircleFill, Search } from 'react-bootstrap-icons';
import { Currency } from "../App";

const ProductList = () => {
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ productName: "", Price: "" });
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sidebarWidth, setSidebarWidth] = useState(250);

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

    const fetchAllProducts = async () => {
        try {
            setLoading(true);
            const Admintoken = localStorage.getItem('admintoken');
            const response = await fetchProducts(Admintoken);
            
            if (response.success) {
                setProducts(response.products || []);
            } else {
                setError('Failed to fetch products. ' + (response.message || ''));
            }
        } catch (error) {
            console.log('Error Fetching Products', error);
            setError('Failed to fetch products. Please try again later.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            if (window.confirm("Are you sure you want to delete this product?")) {
                const response = await deleteProduct(id);
                toast.success('Product deleted successfully!');
                setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));
            }
        } catch (error) {
            toast.error('Error deleting product. Please try again.');
            console.log('Error deleting product:', error);
        }
    }

    useEffect(() => {
        fetchAllProducts();
    }, []);

    const handleEdit = async (id, updatedData) => {
        try {
            const response = await editProduct(id, updatedData);
            toast.success('Product updated successfully!');
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product._id === id ? { ...product, ...updatedData } : product
                )
            );
        } catch (error) {
            toast.error('Failed to update product.');
        }
    };

    const filteredProducts = products.filter(product => 
        product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.Category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.Price?.toString().includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="content-with-sidebar d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <div 
      className="content-wrapper" 
      style={{ marginLeft: `${sidebarWidth}px` }}
    >
            <Card className="border-0 shadow-sm mb-4 product-admin-wrapper">
                <Card.Body className="p-0 p-md-3">
                    <div className="admin-header d-flex flex-column flex-lg-row justify-content-between align-items-lg-center p-3 gap-3">
                        <h3 className="fw-bold mb-0">Products Management</h3>
                        <div className="search-container">
                            <InputGroup>
                                <InputGroup.Text className="bg-light border-end-0">
                                    <Search />
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border-start-0 bg-light"
                                />
                                {searchTerm && (
                                    <Button 
                                        variant="light" 
                                        onClick={() => setSearchTerm("")}
                                        className="border"
                                    >
                                        <XCircleFill />
                                    </Button>
                                )}
                            </InputGroup>
                        </div>
                    </div>

                    {error && (
                        <div className="alert alert-danger mx-3" role="alert">
                            {error}
                        </div>
                    )}

                    <div className="table-responsive">
                        <Table hover borderless className="align-middle mb-0">
                            <thead className="table-header">
                                <tr>
                                    <th className="ps-4">Image</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <tr key={product._id} className="product-row">
                                            <td className="ps-4">
                                                <div className="product-image-container">
                                                    <img 
                                                        src={product.Image?.[0] || "placeholder.jpg"} 
                                                        alt={product.productName || "Product Image"} 
                                                        className="product-thumbnail"
                                                    />
                                                </div>
                                            </td>
                                            <td className="product-name-cell">
                                                {editingId === product._id ? (
                                                    <Form.Control
                                                        size="sm"
                                                        value={editForm.productName}
                                                        onChange={e => setEditForm({ ...editForm, productName: e.target.value })}
                                                    />
                                                ) : (
                                                    <span className="product-name text-wrap">{product.productName}</span>
                                                )}
                                            </td>
                                            <td>
                                                <Badge bg="info" pill className="category-badge">
                                                    {product.Category}
                                                </Badge>
                                            </td>
                                            <td className="product-price-cell">
                                                {editingId === product._id ? (
                                                    <InputGroup size="sm">
                                                        <InputGroup.Text>{Currency}</InputGroup.Text>
                                                        <Form.Control
                                                            type="number"
                                                            value={editForm.Price}
                                                            onChange={e => setEditForm({ ...editForm, Price: e.target.value })}
                                                        />
                                                    </InputGroup>
                                                ) : (
                                                    <span className="product-price">{Currency}{product.Price}</span>
                                                )}
                                            </td>
                                            <td className="action-cell text-center">
                                                {editingId === product._id ? (
                                                    <div className="d-flex justify-content-center">
                                                        <Button
                                                            variant="success"
                                                            size="sm"
                                                            className="action-btn"
                                                            onClick={async () => {
                                                                await handleEdit(product._id, editForm);
                                                                setEditingId(null);
                                                            }}
                                                        >
                                                            <CheckCircleFill />
                                                        </Button>
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            className="action-btn ms-2"
                                                            onClick={() => setEditingId(null)}
                                                        >
                                                            <XCircleFill />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="d-flex justify-content-center">
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            className="action-btn"
                                                            onClick={() => {
                                                                setEditingId(product._id);
                                                                setEditForm({ productName: product.productName, Price: product.Price });
                                                            }}
                                                        >
                                                            <PencilFill />
                                                        </Button>
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            className="action-btn ms-2"
                                                            onClick={() => handleDelete(product._id)}
                                                        >
                                                            <TrashFill />
                                                        </Button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">
                                            {searchTerm ? (
                                                <p className="mb-0">No products match your search.</p>
                                            ) : (
                                                <p className="mb-0">No products available.</p>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
            <ToastContainer position="bottom-right" />
            
            <style jsx>{`
                .product-admin-wrapper {
                    background-color: #fcfcfcff;
                    min-height: 100vh;
                    width: 110%;                   
                }
                .product-admin-wrapper:hover {
                   transform: none; /* Disables zoom effect */
                    cursor: default;
        }
                
                .admin-header {
                    border-bottom: 1px solid rgba(0,0,0,0.05);
                    margin-bottom: 1.5rem;
                }
                
                .search-container {
                    width: 100%;
                    max-width: 400px;
                }
                
                .table-header th {
                    background-color: #f8f9fa;
                    font-weight: 600;
                    color: #495057;
                    padding: 0.75rem;
                    border-bottom: 2px solid rgba(0,0,0,0.05);
                    vertical-align: middle;
                }
                
                .product-row {
                    transition: all 0.2s ease;
                    border-bottom: 1px solid rgba(0,0,0,0.05);
                }
                
                .product-row:hover {
                    background-color: rgba(0, 123, 255, 0.04);
                }
                
                .product-row td {
                    padding: 1rem 0.75rem;
                    vertical-align: middle;
                }
                
                .product-image-container {
                    width: 60px;
                    height: 60px;
                    overflow: hidden;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #fff;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.08);
                }
                
                .product-thumbnail {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                }
                
                .product-name {
                    font-weight: 500;
                    color: #333;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .product-price {
                    font-weight: 600;
                    color: #28a745;
                }
                
                .category-badge {
                    font-size: 0.8rem;
                    font-weight: normal;
                    padding: 0.4em 0.8em;
                }
                
                .action-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    padding: 0;
                    border-radius: 4px;
                    transition: all 0.2s;
                }
                
                .action-btn:hover {
                    transform: translateY(-2px);
                }
                
                /* Media queries to work better with sidebar */
                @media (max-width: 992px) {
                    .product-name-cell {
                        max-width: 180px;
                    }
                }
                
                @media (max-width: 768px) {
                    .product-image-container {
                        width: 45px;
                        height: 45px;
                    }
                    
                    .action-btn {
                        width: 30px;
                        height: 30px;
                    }
                    
                    .product-name-cell {
                        max-width: 140px;
                    }
                    
                    /* Align with collapsed sidebar */
                    .table-header th:first-child,
                    .product-row td:first-child {
                        padding-left: 0.5rem;
                    }
                }
                
                @media (max-width: 576px) {
                    .product-row td {
                        padding: 0.75rem 0.4rem;
                    }
                    
                    .product-image-container {
                        width: 40px;
                        height: 40px;
                    }
                    
                    .action-btn {
                        width: 28px;
                        height: 28px;
                    }
                    
                    .product-price {
                        font-size: 0.9rem;
                    }
                    
                    .category-badge {
                        font-size: 0.75rem;
                        padding: 0.3em 0.6em;
                    }
                    
                    .product-name-cell {
                        max-width: 110px;
                    }
                }
                
                /* Extra small devices */
                @media (max-width: 420px) {
                    .table-header th,
                    .product-row td {
                        padding-left: 0.3rem;
                        padding-right: 0.3rem;
                    }
                    
                    .product-image-container {
                        width: 36px;
                        height: 36px;
                    }
                    
                    .product-name {
                        font-size: 0.85rem;
                    }
                    
                    .product-name-cell {
                        max-width: 90px;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProductList;
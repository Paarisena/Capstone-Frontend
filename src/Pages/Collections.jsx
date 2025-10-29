import { useEffect, useState } from "react";
import { fetchProducts, fetchProductsPublic } from "../Constant";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, Row, Col, Spinner, Pagination, Form } from "react-bootstrap";
import { Currency } from "../App";
import "./Collect.css";
import { FaSearch } from 'react-icons/fa';

const Collections = () => {
    const [collections, setCollections] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentCategory, setCurrentCategory] = useState("1");
    const [totalItems, setTotalItems] = useState(0);
    const [allProducts, setAllProducts] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchCollections = async () => {
        try {
            setLoading(true);
            const response = await fetchProductsPublic();

            if (!response.data || !Array.isArray(response.data)) {
                throw new Error("Invalid response format");
            }

            // Store all products
            setAllProducts(response.data);
            setTotalItems(response.data.length);

            // Group products by category
            const groupedCollections = response.data.reduce((acc, product) => {
                const category = product.category || "1";
                if (!acc[category]) {
                    acc[category] = [];
                }
                acc[category].push(product);
                return acc;
            }, {});

            // Add "all" category containing all products
            groupedCollections["all"] = response.data;

            setCollections(groupedCollections);
            
            // Set initial category from URL or default to "all"
            const categoryParam = searchParams.get("category");
            if (categoryParam && groupedCollections[categoryParam]) {
                setCurrentCategory(categoryParam);
            }
        } catch (error) {
            console.error("Error Fetching Collections:", error);
            setError("Failed to fetch collections. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCollections();
        
        // Get page from URL or default to 1
        const pageParam = parseInt(searchParams.get("page")) || 1;
        setCurrentPage(pageParam);
        
        // Get items per page from URL or default to 12
        const perPageParam = parseInt(searchParams.get("perPage")) || 10;
        setItemsPerPage(perPageParam);
    }, []);
    
    // Update URL when pagination or category changes
    useEffect(() => {
        const params = new URLSearchParams();
        params.set("page", currentPage.toString());
        params.set("perPage", itemsPerPage.toString());
        params.set("category", currentCategory);
        setSearchParams(params);
    }, [currentPage, itemsPerPage, currentCategory]);

    const handleProductClick = (productId) => {
        navigate(`/products/${productId}`);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };
    
    
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    const filterProducts = (products) => {
        if (!searchTerm) return products;
        return products.filter(product => 
            product.productName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    // Update your getCurrentProducts function to include search
    const getCurrentProducts = () => {
        if (!collections[currentCategory]) return [];
        
        const filtered = filterProducts(collections[currentCategory]);
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return filtered.slice(indexOfFirstItem, indexOfLastItem);
    };
    
    // Calculate total pages
    const totalPages = Math.ceil((collections[currentCategory]?.length || 0) / itemsPerPage);

    // Generate pagination items
    const getPaginationItems = () => {
        const items = [];
        
        // Always show first page
        items.push(
            <Pagination.Item 
                key={1} 
                active={1 === currentPage}
                onClick={() => handlePageChange(1)}
            >
                1
            </Pagination.Item>
        );
        
        // Add ellipsis if needed
        if (currentPage > 3) {
            items.push(<Pagination.Ellipsis key="ellipsis-1" disabled />);
        }
        
        // Add pages around current page
        for (let number = Math.max(2, currentPage - 1); number <= Math.min(totalPages - 1, currentPage + 1); number++) {
            if (number === 1 || number === totalPages) continue; // Skip first and last pages as they're always shown
            items.push(
                <Pagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => handlePageChange(number)}
                >
                    {number}
                </Pagination.Item>
            );
        }
        
        // Add ellipsis if needed
        if (currentPage < totalPages - 2) {
            items.push(<Pagination.Ellipsis key="ellipsis-2" disabled />);
        }
        
        // Always show last page if there's more than one page
        if (totalPages > 1) {
            items.push(
                <Pagination.Item
                    key={totalPages}
                    active={totalPages === currentPage}
                    onClick={() => handlePageChange(totalPages)}
                >
                    {totalPages}
                </Pagination.Item>
            );
        }
        
        return items;
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    // Get category names for display
    const getCategoryName = (categoryCode) => {
        const categoryMap = {
            "1": "All Paintings",
            "abstract": "Abstract Wall Art",
            "wabi-sabi": "Wabi Sabi Wall Art",
            "minimalist": "Minimalist Wall Art"
        };
        return categoryMap[categoryCode] || "Other Collections";
    };

    return (
        <div className="collections-wrapper py-5 px-3 px-md-5" style={{ position: 'relative', top:'4rem' }}>
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            
            <div className="collection-header d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
                <h2 className="collection-title mb-3 mb-md-0">{getCategoryName(currentCategory)}</h2>

                <div className="d-flex align-items-center">
                    <div className={`search-container ${showSearch ? 'active' : ''}`}>
                        <button 
                            className="search-icon-btn"
                            onClick={() => setShowSearch(!showSearch)}
                        >
                            <FaSearch />
                        </button>
                        {showSearch && (
                            <input
                                type="search"
                                placeholder="Search products..."
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                        )}
                    </div>

                    <div className="me-3 d-flex align-items-center">
                        <span className="me-2 text-muted d-none d-sm-block">Show:</span>
                        <Form.Select 
                            size="sm" 
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            className="items-per-page"
                        >
                            <option value="8">8</option>
                            <option value="12">12</option>
                            <option value="24">24</option>
                            <option value="48">48</option>
                        </Form.Select>
                    </div>
                    
                    <div className="items-info text-muted">
                        {collections[currentCategory]?.length || 0} items
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            {Object.keys(collections).length > 0 ? (
                <>
                    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                        {getCurrentProducts().map((product) => (
                            <Col key={product._id}>
                                <Card 
                                    className="h-100 product-card" 
                                    onClick={() => handleProductClick(product._id)}
                                >
                                    <div className="card-img-wrapper">
                                        <Card.Img
                                            variant="top"
                                            src={product.Image?.[0] || "placeholder.jpg"}
                                            alt={product.productName || "Product Image"}
                                            className="product-image"
                                        />
                                    </div>
                                    <Card.Body className="d-flex flex-column justify-content-between">
                                        <Card.Title className="product-title">
                                            {product.productName}
                                        </Card.Title>
                                        <Card.Text className="product-price">
                                            {Currency}{product.Price}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    
                    {/* Pagination */}
                    {totalPages > 0 && (
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination className="pagination-nav">
                                <Pagination.Prev 
                                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                />
                                
                                {getPaginationItems()}
                                
                                <Pagination.Next 
                                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                />
                            </Pagination>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-5">
                    <p className="fs-4">No collections available.</p>
                </div>
            )}

            <style jsx>{`   
                .collections-wrapper {
                    max-width: 1600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                }
                
                .category-nav {
                    border-bottom: 1px solid #eaeaea;
                    overflow-x: auto;
                    white-space: nowrap;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: none;
                }
                
                .category-nav::-webkit-scrollbar {
                    display: none;
                }
                
                .category-btn {
                    background: none;
                    border: none;
                    padding: 8px 16px;
                    margin-right: 8px;
                    border-radius: 30px;
                    font-weight: 500;
                    font-size: 0.95rem;
                    color: #666;
                    transition: all 0.2s;
                    white-space: nowrap;
                    border: 1px solid #e0e0e0;
                }
                
                .category-btn:hover {
                    background-color: #f8f9fa;
                    color: #333;
                }
                
                .category-btn.active {
                    background-color: #007bff;
                    color: white;
                    border-color: #007bff;
                }
                
                .collection-title {
                    font-weight: 600;
                    color: #333;
                    position: relative;
                    margin: 0;
                    font-size: 1.75rem;
                }
                
                .collection-header {
                    margin-bottom: 1.5rem;
                }
                
                .items-per-page {
                    width: 70px;
                    border-radius: 4px;
                }
                
                .items-info {
                    font-size: 0.9rem;
                    white-space: nowrap;
                }
                
                .product-card {
                    transition: transform 0.3s, box-shadow 0.3s;
                    cursor: pointer;
                    border: none;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                
                .product-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 15px rgba(0,0,0,0.1);
                }
                
                .card-img-wrapper {
                    overflow: hidden;
                    position: relative;
                    padding-top: 75%; /* 4:3 Aspect Ratio */
                }
                
                .product-image {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s;
                }
                
                .product-card:hover .product-image {
                    transform: scale(1.05);
                }
                
                .product-title {
                    font-size: 1.1rem;
                    font-weight: 500;
                    margin-bottom: 8px;
                    color: #333;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
                
                .product-price {
                    font-weight: bold;
                    color: #007bff;
                    margin-bottom: 0;
                    font-size: 1.2rem;
                }
                
                .pagination-nav .page-link {
                    color: #007bff;
                    border-color: #dee2e6;
                    margin: 0 2px;
                    border-radius: 4px;
                }
                
                .pagination-nav .page-item.active .page-link {
                    background-color: #007bff;
                    border-color: #007bff;
                }
                
                .pagination-controls {
                    flex-wrap: wrap;
                    gap: 10px;
                }

                .search-container {
                    position: relative;
                    margin-right: 1rem;
                    display: flex;
                    align-items: center;
                }

                .search-icon-btn {
                    background: none;
                    border: none;
                    color: #007bff;
                    font-size: 1.2rem;
                    padding: 0.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    z-index: 2;
                }

                .search-icon-btn:hover {
                    color: #0056b3;
                }

                .search-input {
                    position: absolute;
                    right: 0;
                    width: 0;
                    padding: 0.5rem;
                    border: none;
                    border-radius: 20px;
                    background: rgba(201, 199, 199, 0.95);
                    backdrop-filter: blur(10px);
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                    opacity: 0;
                }

                .search-container.active .search-input {
                    width: 250px;
                    padding: 0.5rem 2.5rem 0.5rem 1rem;
                    opacity: 1;
                    border: 1px solid rgba(0, 123, 255, 0.2);
                }

                .search-input:focus {
                    outline: none;
                    border-color: rgba(0, 123, 255, 0.5);
                    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
                }

                @media (max-width: 768px) {
                    .search-container.active .search-input {
                        width: 200px;
                    }
                }

                @media (max-width: 576px) {
                    .search-container.active .search-input {
                        width: 150px;
                    }
                }

                /* Media queries */
                @media (max-width: 991px) {
                    .collection-title {
                        font-size: 1.6rem;
                    }
                }
                
                @media (max-width: 767px) {
                    .collection-title {
                        font-size: 1.5rem;
                    }
                    
                    .product-title {
                        font-size: 1rem;
                    }
                    
                    .product-price {
                        font-size: 1.1rem;
                    }
                    
                    .collection-header {
                        text-align: center;
                    }
                }
                
                @media (max-width: 576px) {
                    .pagination-nav .page-link {
                        padding: 0.4rem 0.65rem;
                    }
                    
                    .category-btn {
                        padding: 6px 14px;
                        font-size: 0.9rem;
                    }
                    
                    .collection-title {
                        font-size: 1.4rem;
                    }
                    
                    .product-price {
                        font-size: 1rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Collections;
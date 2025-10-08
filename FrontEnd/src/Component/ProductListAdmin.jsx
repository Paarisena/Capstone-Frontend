import React, { useEffect,useState } from "react";
import { fetchProducts, deleteProduct} from "../Constant";
import { Card,Container,Row,Col,Table } from "react-bootstrap";
import{ toast, ToastContainer } from 'react-toastify';
import { Currency } from "../App";



const ProductList =({})=>{

    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
        const fetchAllProducts = async () => {
            try {
                const response = await fetchProducts()
                console.log("Products fetched:", response);
                setProducts(response.products || []);
            } catch (error) {
                console.log('Error Fetching Products', error);
                setError('Failed to fetch products. Please try again later.');
                setProducts([]);
            }
        };

        const handleDelete = async (id) => {
            try {
                const response = await deleteProduct(id);
                console.log("Product deleted:", response);
                toast.success('Product deleted successfully!'); 
                setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));
                console.log("Deleted product:", id);
                console.log("Updated products:", products);
            }catch (error) {
                console.log('Error deleting product:', error);
            }
        }
   useEffect(() => {
    fetchAllProducts()
   }, []);


    return(
        
<Container>  
 <p className="mb-2">All Products List</p>

<div className="d-flex flex-column gap-2">
  <Table responsive="md" className="text-center">
    <thead>
      <tr>
        <th>Image</th>
        <th>Name</th>
        <th>Category</th>
        <th>Price</th>
        <th>Action</th>
      </tr>
    </thead>
    
            <tbody>
    {products && products.length > 0 ? (
        products.map((product) => (
            <tr key={product._id}>
                <td>
                    <img
                        src={product.Image[0] || "placeholder.jpg"}
                        alt={product.productName || "Product Image"}
                        style={{ width: "50px" }}
                    />
                </td>
                <td>{product.productName}</td>
                <td>{product.Category}</td>
                <td>{Currency}{product.Price}</td>
                <td>
                    <button className="btn btn-danger btn-sm ms-2" onClick={()=>handleDelete(product._id)}>Delete</button>
                </td>
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan="5">No products available.</td>
        </tr>
    )}
</tbody>
            </Table>
            </div>
            <ToastContainer/>
        </Container>

    )
}

export default ProductList
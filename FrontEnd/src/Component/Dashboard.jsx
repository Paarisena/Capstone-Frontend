import { useState,useContext } from 'react';
import {Form, Button, Col, Row} from 'react-bootstrap';
import { addProduct } from '../Constant';
import{ toast, ToastContainer } from 'react-toastify';
import './dashboard.css';
import { ProductContext } from '../ProductProvider';



const AddProd = () =>{
    const [image1,setImage1] = useState("")
    const [image2,setImage2] = useState("")
    const [image3,setImage3] = useState("")
    const [image4,setImage4] = useState("")
   const [name, setName] = useState("");
   const [description, setDescription] = useState("");
   const [price, setPrice] = useState("");
   const [category, setCategory] = useState("1");



const handleProductSubmit = async (e) => {
  try{
  e.preventDefault();
    const formData = new FormData();
    formData.append('productName', name);
    formData.append('productDescription',description);
    formData.append('Price', price);
    formData.append("Category",category);
    
    image1 && formData.append("image1",image1)
    image2 && formData.append("image2",image2)
    image3 && formData.append("image3",image3)
    image4 && formData.append("image4",image4)
 const response = await addProduct(formData);
        (toast.success('Product Added Successfully'));
        
    if (response) {
        toast.success(response)
        setName('')
        setDescription('')
        setCategory('1')
        setImage1([null])
        setImage2([null])
        setImage3([null])
        setImage4([null])
        setPrice('')
      } else {
        toast.error(response)
      }

    } catch (error) {
        console.log(error);
    }
};
return (
  <div className="dashboard-container">
    <div className="dashboard-form-wrapper">
      <Form onSubmit={handleProductSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} md="4" controlId="validationCustom01">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustom02">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col} md="3" controlId="validationCustom03">
            <Form.Label>Category</Form.Label>
            <Form.Select
              aria-label="Default select example"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="1">Wabi Sabi Wall Art</option>
              <option value="2">Abstract Wall Art</option>
              <option value="3">3D Minimalist Wall Art</option>
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustom04">
            <Form.Label>Price</Form.Label>
            <Form.Control
              required
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustom05">
            <Form.Label>Uploads</Form.Label>
            <Form.Control type="file" onChange={(e) => setImage1(e.target.files[0])} />
            <Form.Control type="file" onChange={(e) => setImage2(e.target.files[0])} />
            <Form.Control type="file" onChange={(e) => setImage3(e.target.files[0])} />
            <Form.Control type="file" onChange={(e) => setImage4(e.target.files[0])} />
          </Form.Group>
        </Row>
        <Button type="submit">Add</Button>
        <ToastContainer />
      </Form>
    </div>
  </div>
);

}
export default AddProd;


                    

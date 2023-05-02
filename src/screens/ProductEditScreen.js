import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {Form, Button, Alert} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { listProductDetails, updateProduct } from '../actions/productActions';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';

function ProductEditScreen() {
    const {id:productId} = useParams();
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const productDetails = useSelector(state => state.productDetails);
    const {loading, error, product} = productDetails;

    const productUpdate = useSelector(state => state.productUpdate);
    const {loading:loadingUpdate, error:errorUpdate, success:successUpdate} = productUpdate;

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        formData.append('product_id', productId);
        setUploading(true);
        try {
            const config = {
                headers: {
                    'Content-Type':'multipart/form-data'
                }
            }
            const {data} = await axios.post('/api/products/upload/', formData, config);
            setImage(data)
            setUploading(false);
        } catch(error){
            setUploading(false);
        }
    }

    useEffect(() => {
        if (successUpdate) {
            dispatch({type:PRODUCT_UPDATE_RESET});
            navigate('/admin/productlist');
        } else {
            if (!product.name || product._id !== +productId) {
                dispatch(listProductDetails(productId))            
            } else {
                setName(product.name);
                setPrice(product.price);
                setImage(product.image);
                setBrand(product.brand);
                setCategory(product.category);
                setCountInStock(product.countInStock);
                setDescription(product.description);
            } 
        }            
    }, [dispatch, product, productId, navigate, successUpdate]);

    const submitHandler = (e)  => {
        e.preventDefault();
        dispatch(updateProduct({
            _id:productId,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description
        }));  
    }
    return (
        <div>
            <Link to={`/admin/productlist`}>
                Go Back
            </Link>
            <FormContainer>
                <h1 style={{margin: '1rem'}}>Edit Product</h1>
                {loadingUpdate && <Loader/>}
                {errorUpdate && <Alert variant='danger'>{errorUpdate}</Alert>}
                {loading ? <Loader/> : error ? <Alert variant='danger'>{error}</Alert> : (
                    <Form onSubmit={submitHandler}>
                    
                        <Form.Group controlId='name' style={{padding: '1rem'}}>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="name"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                    
                        <Form.Group controlId='price' style={{padding: '1rem'}}>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                    
                        <Form.Group controlId='image' style={{padding: '1rem'}}>
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter image"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                            ></Form.Control>

                            <Form.Control
                                type='file'
                                label='Choose File'
                                onChange={uploadFileHandler}
                            ></Form.Control>
                            {uploading && <Loader/>}
                        </Form.Group>
                    
                        <Form.Group controlId='brand' style={{padding: '1rem'}}>
                            <Form.Label>Brand</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter brand"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                    
                        <Form.Group controlId='countinstock' style={{padding: '1rem'}}>
                            <Form.Label>Count In Stock</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter stock"
                                value={countInStock}
                                onChange={(e) => setCountInStock(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                    
                        <Form.Group controlId='category' style={{padding: '1rem'}}>
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                    
                        <Form.Group controlId='description' style={{padding: '1rem'}}>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
        
                        <Button type='submit' variant='primary' style={{margin: '1rem'}}>Update</Button>
        
                    </Form>
                    
                )}
            </FormContainer>
        </div>
        
    );
}

export default ProductEditScreen;
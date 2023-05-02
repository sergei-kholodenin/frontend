import React, {useState,useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate} from 'react-router-dom';
import { Row, Col, Image, ListGroup, Button, Card, Form, Alert } from 'react-bootstrap';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import { listProductDetails, createProductReview } from '../actions/productActions';
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants';

function ProductScreen() {
    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const dispatch = useDispatch();
    
    const productDetails = useSelector(state => state.productDetails);
    const {loading, error, product} = productDetails;

    const productCreateReview = useSelector(state => state.productCreateReview);
    const {loading:loadingProductReview, error:errorProductReview, success:successProductReview} = productCreateReview;

    const userLogin = useSelector(state => state.userLogin);
    const {userInfo} = userLogin;

    const {id} = useParams();
    let navigate = useNavigate();

    useEffect(() => {
        if (successProductReview) {
            setRating(0);
            setComment('');
            dispatch({type:PRODUCT_CREATE_REVIEW_RESET});
        }
        dispatch(listProductDetails(id));
    }, [dispatch, id, successProductReview]);

    const addToCartHandler = () => {
        navigate(`/cart/${id}?qty=${qty}`);
    }

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(createProductReview(
            id, {
                rating,
                comment
            }
        ))
    }

    return (
        <div>
            <Link to='/' className='btn btn-light my-3' >Go Back</Link>
            {loading ? <Loader/> :
            error ? <Alert variant="danger">{error}</Alert> :
            <div>
                <Row>
                    <Col md={6}>
                        <Image src={product.image} alt={product.name} fluid/>
                    </Col>
                    <Col md={3}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h3>{product.name}</h3>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'} />
                            </ListGroup.Item>

                            <ListGroup.Item>
                                Price: ${product.price}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                Description: {product.description}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={3}>
                        <Card>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Price:</Col>
                                        <Col>
                                        <strong>${product.price}</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Status:</Col>
                                        <Col>
                                            {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                {product.countInStock > 0 && (
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Qty</Col>
                                            <Col xs="auto" className='my-1'>
                                                <Form.Control
                                                    as="select"
                                                    value={qty}
                                                    onChange={(e) => setQty(e.target.value)}>
                                                        {
                                                            [...Array(product.countInStock).keys()].map(x => (
                                                                <option key={x + 1} value={x + 1}>
                                                                    {x + 1}
                                                                </option>
                                                            ))
                                                        }
                                                </Form.Control>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}
                                <ListGroup.Item>
                                    <Row className='p-3'>
                                        <Button 
                                        onClick={addToCartHandler}
                                        className='btn-block' 
                                        type='button' 
                                        disabled={product.countInStock < 1}
                                        >Add to cart</Button>
                                    </Row>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
                <Row style={{marginTop: '3rem'}}>
                    <Col md={6}>
                        <h4>Reviews</h4>
                        {product.reviews.length === 0 && <Alert variant='info'>No Reviews</Alert>}

                        <ListGroup variant='flush'>
                            {product.reviews.map(review => (
                                <ListGroup.Item key={review._id}>
                                    <strong>{review.name}</strong>
                                    <Rating value={review.rating} color='#f8e825'/>
                                    <p>{review.createdAt.substring(0, 10)}</p>
                                    <p>{review.comment}</p>
                                </ListGroup.Item>
                            ))}
                            <ListGroup.Item>
                                <h4>Write a review</h4>
                                {loadingProductReview && <Loader/>}
                                {successProductReview && <Alert variant='success'>Review Submited</Alert>}
                                {errorProductReview && <Alert variant='danger'>{errorProductReview}</Alert>}
                                {userInfo ? (
                                    <Form onSubmit={submitHandler}>
                                        <Form.Group controlId='rating'>
                                            <Form.Label>Rating</Form.Label>
                                            <Form.Control
                                                as='select'
                                                value={rating}
                                                onChange={e => setRating(e.target.value)}
                                            >
                                                <option value="">Select...</option>
                                                <option value="1">1 - Poor</option>
                                                <option value="2">2 - Fair</option>
                                                <option value="3">3 - Good</option>
                                                <option value="4">4 - Very Good</option>
                                                <option value="5">5 - Excellent</option>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group controlId='comment'>
                                            <Form.Label>Review</Form.Label>
                                            <Form.Control
                                                as='textarea'
                                                row='5'
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                            >
                                            </Form.Control>
                                        </Form.Group>
                                        <Button
                                            style={{marginTop: '1rem'}}
                                            disabled={loadingProductReview}
                                            type='submit'
                                            variant='primary'
                                        >Submit</Button>
                                    </Form>
                                ) : <Alert variant='info'>Please <Link to='/login'>Login</Link> to write a review</Alert>}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            </div>
            }
            
        </div>
    );
}

export default ProductScreen;
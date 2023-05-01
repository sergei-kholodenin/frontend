import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row, ListGroup, Image, Card, Alert } from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../components/Loader';
import { getOrderDetails, payOrder } from '../actions/orderActions';
import { ORDER_PAY_RESET } from '../constants/orderConstants';

function OrderScreen() {
    const {id} = useParams();    
    const dispatch = useDispatch();

    const orderDetails = useSelector(state => state.orderDetails);
    const {order, error, loading} = orderDetails;

    const orderPay = useSelector(state => state.orderPay);
    let {success:successPay} = orderPay;

    if (!loading && !error) {
        order.itemPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);
    }    

    useEffect(() => {
        if (!order || successPay || order._id !== +id) {            
            dispatch({type: ORDER_PAY_RESET});
            dispatch(getOrderDetails(id));
        }       
    }, [dispatch, successPay, order, id]);

    const payOrderHandler = (e) => {
        successPay = true;
        dispatch(payOrder(id, successPay));
    }


    return loading ? (<Loader/>) : error ? (<Alert variant='danger'>{error}</Alert>) : (
        <div>
            <h1>Order: #{order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>

                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p><strong>Name: </strong>{order.user.name}</p>
                            <p><strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                            <p>
                                <strong>Shipping: </strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country} 
                                
                            </p>
                            {order.isDelivered ? (
                                <Alert variant='success'>Delivered on: {order.deliveredAt}</Alert>
                            ) : (
                                <Alert variant='warning'>Not delivered</Alert>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Payment Method: </strong>
                                {order.paymentMethod}
                            </p>
                            {order.isPaid ? (
                                <Alert variant='success'>Paid on: {order.paidAt}</Alert>
                            ) : (
                                <Alert variant='warning'>Not paid</Alert>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {order.orderItems.length === 0 ? <Alert variant='info'>
                                Order is empty
                            </Alert> : (
                                <ListGroup variant='flush'>
                                    {order.orderItems.map((item, i) => (
                                        <ListGroup.Item key={i}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded/>
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} X ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                            
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            
                            <ListGroup.Item>
                                <h2>Order summary</h2>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Item:</Col>
                                    <Col>${order.itemPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            
                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {loading && <Loader/>}
                                    <Row style={{padding: '1rem'}}>
                                        <Button
                                            type='button'
                                            className='btn-block'
                                            onClick={payOrderHandler}
                                        >
                                            Pay Order
                                        </Button>
                                    </Row>
                            </ListGroup.Item>
                            )}                            

                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default OrderScreen;
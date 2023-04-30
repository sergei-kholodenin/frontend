import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Col, Row, ListGroup, Image, Card, Alert } from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../actions/orderActions';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';

function PlaceOrderScreen() {
    const orderCreate = useSelector(state => state.orderCreate)
    const {order, error, success} = orderCreate
    const cart = useSelector(state => state.cart);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    cart.itemPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);

    cart.shippingPrice = (cart.itemPrice > 100 ? 0 : 10).toFixed(2);

    cart.taxPrice = (cart.itemPrice * 0.082).toFixed(2);

    cart.totalPrice = (+cart.itemPrice + +cart.shippingPrice + +cart.taxPrice).toFixed(2);

    if (!cart.paymentMethod) {
        navigate('/payment');
    }

    useEffect(() => {
       if (success) {
        navigate(`/order/${order._id}`);
        dispatch({
            type: ORDER_CREATE_RESET
        })
       } 
    }, [success, navigate])

    const placeOrder = (e) => {
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice
        }));

    }

    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4/>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>

                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Shipping: </strong>
                                {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country} 
                                
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Payment Method: </strong>
                                {cart.paymentMethod}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {cart.cartItems.length == 0 ? <Alert variant='info'>
                                Your cart is empty
                            </Alert> : (
                                <ListGroup variant='flush'>
                                    {cart.cartItems.map((item, i) => (
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
                                    <Col>${cart.itemPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>${cart.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>${cart.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>${cart.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                {error && <Alert variant='danger'>{error}</Alert>}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row style={{padding: '1rem'}}>
                                    <Button
                                        type='button'
                                        className='btn-block'
                                        disabled={cart.cartItems.length == 0}
                                        onClick={placeOrder}
                                    >
                                        Place Order
                                    </Button>
                                </Row>
                            </ListGroup.Item>

                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default PlaceOrderScreen;
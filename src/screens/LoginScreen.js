import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {Form, Button, Row, Col, Alert} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { login } from '../actions/userActions';

function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const search = useLocation().search;
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const redirect = search ? search.split('=')[1] : '/';

    const userLogin = useSelector(state => state.userLogin);
    const {loading, error, userInfo} = userLogin;

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, userInfo, redirect]);

    const submitHandler = (e)  => {
        e.preventDefault();
        dispatch(login(email, password));
    }
    return (
        <FormContainer>
            <h1 style={{margin: '1rem'}}>Sign in</h1>
            {error && <Alert variant='danger'>{error}</Alert>}
            {loading && <Loader />}
            <Form onSubmit={submitHandler}>

                <Form.Group controlId='email' style={{padding: '1rem'}}>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control 
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='password' style={{padding: '1rem'}}>
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary' style={{margin: '1rem'}}>Sign in</Button>
            </Form>

            <Row className='py-3'>
                <Col>
                    New customer? <Link to={
                        redirect ? `/register?redirect=${redirect}` : '/register'
                    }>Register</Link>
                </Col>
            </Row>
        </FormContainer>
    );
}

export default LoginScreen;
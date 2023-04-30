import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {Form, Button, Row, Col, Alert} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { register } from '../actions/userActions';

function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const search = useLocation().search;
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const redirect = search ? search.split('=')[1] : '/';

    const userRegister = useSelector(state => state.userRegister);
    const {loading, error, userInfo} = userRegister;

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, userInfo, redirect]);

    const submitHandler = (e)  => {
        e.preventDefault();
        if(password !== confirmPassword) {
            setMessage('Password do not match!');
        } else {
            dispatch(register(name, email, password));
        }        
    }
    return (
        <FormContainer>
            <h1 style={{margin: '1rem'}}>Sign in</h1>
            {message && <Alert variant='danger'>{message}</Alert>}
            {error && <Alert variant='danger'>{error}</Alert>}
            {loading && <Loader />}
            <Form onSubmit={submitHandler}>
                
            <Form.Group controlId='name' style={{padding: '1rem'}}>
                <Form.Label>Name</Form.Label>
                <Form.Control
                    required 
                    type="name"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                ></Form.Control>
            </Form.Group>

            <Form.Group controlId='email' style={{padding: '1rem'}}>
                <Form.Label>Email Address</Form.Label>
                <Form.Control 
                    type="email"
                    required
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
            </Form.Group>

            <Form.Group controlId='password' style={{padding: '1rem'}}>
                <Form.Label>Password</Form.Label>
                <Form.Control 
                    type="password"
                    required
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
            </Form.Group>

            <Form.Group controlId='passwordConfirm' style={{padding: '1rem'}}>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control 
                    type="password"
                    required
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary' style={{margin: '1rem'}}>Register</Button>

            </Form>

            <Row className='py-3'>
                <Col>
                    Have an account? <Link to={
                        redirect ? `/login?redirect=${redirect}` : '/login'
                    }>Sign in</Link>
                </Col>
            </Row>
        </FormContainer>
    );
}

export default RegisterScreen;
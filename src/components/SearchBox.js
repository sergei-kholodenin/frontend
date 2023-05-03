import React, {useState} from 'react';
import { Form, Button} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';

function SearchBox() {
    const [keyword, setKeyword] = useState('');

    let navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword) {
            navigate(`/?keyword=${keyword}&page=1`)
        } else {
            navigate(0)
        }
    }
    return (
        <Form onSubmit={submitHandler} className='d-flex' inline='true'>
            <Form.Control
                type='text'
                name='q'
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className='mr-sm-2 ml-sm-5'
            ></Form.Control>
            <Button
                type='submit'
                variant='outline-success'
                style={{marginLeft: '1rem'}}
            >Submit</Button>
        </Form>
    );
}

export default SearchBox;
import React from 'react';
import {Pagination, Button} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';

function Paginate({pages, page, keyword='', isAdmin=false}) {
    const navigate = useNavigate();
    return (
        <div>
            {pages > 1 && (
                <Pagination>
                    {[...Array(pages).keys()].map(x => (
                        <Button
                            type='button'
                            variant='light' 
                            key={x + 1}
                            onClick={() => {
                                !isAdmin 
                                    ? navigate(`/?keyword=${keyword}&page=${x + 1}`) 
                                    : navigate(`/admin/productlist/?keyword=${keyword}&page=${x + 1}`)
                                }}
                        >
                            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
                        </Button>
                    ))}
                </Pagination>
            )}
        </div>
    );
}

export default Paginate;
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import Userdetail from '../profile/Userdetail';

function Userprofile() {
    const [closeprofile, setCloseprofile] = useState(true);
    const [show, setShow] = useState(false);
    const [activeButton, setActiveButton] = useState(''); // State to track active button

    const handleButtonClick = (buttonName) => {
        setShow(true);
        setCloseprofile(false);
        setActiveButton(buttonName); // Set the active button when clicked
    };

    return (
        <>
            <hr />
            <Navbar bg="white" data-bs-theme="dark">
                <Container>
                    <Nav className="me-auto">
                        <button
                            as={Link}
                            to="studentdetail"
                            onClick={() => handleButtonClick('userDetail')}
                            className={`btn btn-outline-dark mr-3 ${activeButton === 'userDetail' ?'active':''}`}
                        >
                            User Detail
                        </button>
                        <div className="mx-2"></div>
                        <button
                            as={Link}
                            to="classdetail"
                            onClick={() => handleButtonClick('addClassDetail')}
                            className={`btn btn-outline-dark ${activeButton === 'addClassDetail' && 'active'}`}
                        >
                            Add Class Detail
                        </button>
                    </Nav>
                </Container>
            </Navbar>
            <hr />
            {closeprofile && <h1>Check</h1>}
            {show && <Userdetail />}
        </>
    );
}

export default Userprofile;

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import {Link} from 'react-router-dom'
import  AuthUser from '../component/AuthUser'
import Home from '../dasboard/Home.js'
function Auth() {
     const {logout} = AuthUser();
   const logoutUser = ()=>{
   logout(); // Call logout function from AuthUser
   }
  return (
    <>
      {['sm'].map((expand) => (
        <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3">
          <Container fluid>
          <img src="./image/book.jpg" width="50px" height="50px" style={{borderRadius: '50%'}}/>
            <Navbar.Brand as={Link} to="/">Notes Sharing</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="top"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                   Notes Sharing
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="me-auto flex-grow-1 pe-3">
                  <Nav.Link as={Link}to="/Login">Home</Nav.Link>
                  <Nav.Link as={Link}to="/Login">Feature</Nav.Link>
                   <NavDropdown title="Upload"id={`offcanvasNavbarDropdown-expand-${expand}`}>
                    <NavDropdown.Item href="#action3">File</NavDropdown.Item>
                    <NavDropdown.Item href="#action4">Image</NavDropdown.Item>
                    <NavDropdown.Item href="#action5">Video</NavDropdown.Item>
                  </NavDropdown>
                  </Nav>

                   <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link as={Link} to="/Logout" onClick={logoutUser}>Logout</Nav.Link>
                </Nav>

                
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default Auth;
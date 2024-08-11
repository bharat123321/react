import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import {
  Navbar,
  Container,
  Form,
  ListGroup,
  Nav,
  Offcanvas
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthUser from '../component/AuthUser';

function Nav_bar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { http } = AuthUser();
  const navigate = useNavigate();
  const searchResultsRef = useRef(null); // Ref for the search results

  // Function to handle search input changes
  const handleSearchChange = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    console.log(term);

    if (term) {
      try {
        // Fetch search suggestions from the backend
        const response = await http.get(`/search`, {
          params: { term }
        });
        setSearchResults(response.data.resultdata);
        console.log(response.data.resultdata);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Function to handle search submission
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      navigate(`/search/${searchTerm}`); // Navigate to the search page with query
    }
  };

  // Function to handle clicks outside the search results
  const handleClickOutside = (event) => {
    if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    // Add event listener to detect clicks outside of search results
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Cleanup event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {['sm'].map((expand) => (
        <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3">
          <Container fluid>
            <Navbar.Brand as={Link} to="/">GFN</Navbar.Brand>
            <Form
              role="search"
              className="d-flex me-auto search-wrapper"
              onSubmit={(e) => e.preventDefault()} 
            >
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <Form.Control
                type="search"
                placeholder="Search Topic"
                aria-label="Search"
                className="me-2 search-input"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={handleSearch}
              />
            </Form>
            {searchResults.length > 0 && (
              <ListGroup className="search-results" ref={searchResultsRef}>
                {searchResults.map((result, index) => (
                  <ListGroup.Item
                    key={index}
                    onClick={() => navigate(`/search/${result.topic}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <strong>{result.topic}</strong>
                    <br />
                    {result.description}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="top"
            >
              <Offcanvas.Header closeButton>
                <img src="./image/book.jpg" width="45px" height="45px" style={{ borderRadius: '50%' }} alt="User avatar" />
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  GFN
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3" style={{ marginTop: "-20px" }}>
                  <Nav.Link as={Link} to="/collbooks">Book</Nav.Link>
                  <Nav.Link as={Link} to="/Login">Login</Nav.Link>
                  <Nav.Link as={Link} to="/Register">Register</Nav.Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default Nav_bar;

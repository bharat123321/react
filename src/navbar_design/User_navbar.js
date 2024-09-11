import React, { useEffect, useState } from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBell, faUpload, faCogs } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthUser from '../component/AuthUser';
import './UserNavbar.css'; // Import custom styles for smooth underline

const UserNavbar = () => {
  const { logout, http } = AuthUser();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route
  const [user, setUser] = useState([]);

  const logoutUser = () => {
    logout();
    navigate('/logout');
  };

  const userVerify = async () => {
    try {
      const res = await http.get('/userverify');
      setUser(res.data.user);
    } catch (error) {
      console.error('Error verifying user:', error);
    }
  };

  useEffect(() => {
    userVerify();
  }, []);

  return (
    <>
      <Nav className="me-auto d-flex align-items-center navbar-links">
        <Nav.Link
          as={Link}
          to="/home"
          className={`d-flex align-items-center ${location.pathname === '/home' ? 'active' : ''}`}
        >
          <FontAwesomeIcon icon={faHome} size="lg" className="me-2" />
          <span>Home</span>
        </Nav.Link>

        <Nav.Link
          as={Link}
          to="/notification"
          className={`d-flex align-items-center ${location.pathname === '/notification' ? 'active' : ''}`}
        >
          <FontAwesomeIcon icon={faBell} size="lg" className="me-2" />
          <span>Notifications</span>
        </Nav.Link>

        <Nav.Link
          as={Link}
          to="/upload"
          className={`d-flex align-items-center ${location.pathname === '/upload' ? 'active' : ''}`}
        >
          <FontAwesomeIcon icon={faUpload} size="lg" className="me-2" />
          <span>Upload</span>
        </Nav.Link>

        <NavDropdown title={<FontAwesomeIcon icon={faCogs} size="lg" />} align="end">
          <NavDropdown.Item as={Link} to="/profile">
            <img
              src={user.avatar ? `http://localhost:8000/avatar/${user.avatar}` : './image/book.jpg'}
              width="30px"
              height="30px"
              className="rounded-circle me-2"
              alt="User Avatar"
            />
            Your Profile
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={logoutUser}>Logout</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </>
  );
};

export default UserNavbar;

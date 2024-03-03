import {Navbar, Nav} from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from 'react-router-dom';

function Welcome()
{

	return (
<Navbar bg="black" data-bs-theme="dark">
       
           <Link to="/" className="nav_wrap">Notes_Collection</Link>
          <Nav className="ml-auto ">
            <Link  to="/login" className="nav_wrap">Login</Link>
            <Link to="/register"className="nav_wrap">Register</Link>
           
          </Nav>
          
      </Navbar> 
      
         
		)
}

export default Welcome
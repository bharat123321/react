 
 
import {BrowserRouter , Routes , Route,Link} from 'react-router-dom'
 

function Navbar() {
 
  return (
   <div className="App">
    
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <ul className="navbar-nav">
    <li className="nav-item">
    <Link className="nav-link" to="/Login">Login</Link>
     <Link className="nav-link" to="/Register">Register</Link>
    </li>
    </ul>
</nav>
       
      
          
           
     
            </div>
  );
}

export default Navbar;

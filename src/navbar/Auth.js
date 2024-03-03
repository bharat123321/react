 
import {BrowserRouter , Routes , Route,Link} from 'react-router-dom'
import  AuthUser from '../component/AuthUser'
import Home from '../dasboard/Home.js'
function Auth() {
   const {logout} = AuthUser();
   const logoutUser = ()=>{
   logout(); // Call logout function from AuthUser
       
        
   }   

  return (
     
    <div className="App">
    
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <ul className="navbar-nav">
    <li className="nav-item">
    <Link className="nav-link" to="/home">Home</Link>
    
    <Link className="nav-link" to="/Logout" onClick={logoutUser}>Logout</Link>
    </li>
    </ul>
</nav>
       <Home />
      
          
           
     
            </div>
            
  );
}

export default Auth;

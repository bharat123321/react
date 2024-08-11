 
import React,{useState} from 'react'
import Auth from "../navbar_design/Auth"
import {Link} from "react-router-dom"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Studentdetail from "../Result/Studentdetail"
const Results=()=>{
	const[showdetail,setShow] = useState(false);
	 const handleStudentDetail=()=>{
        setShow(true);
	 }
	return (
		<>
		
		<hr/>
		<Navbar bg="white" data-bs-theme="dark">
  <Container>
    <Nav className="me-auto">  
        <button as={Link} to="studentdetail" onClick={handleStudentDetail} className="btn btn-outline-dark mr-3">Add Student Detail</button>
        <div className="mx-2"></div>
        <button as={Link} to="classdetail" onClick={handleStudentDetail} className="btn btn-outline-dark">Add Class Detail</button>
       
    </Nav>
  </Container>
</Navbar>

       <hr/>
          {showdetail && <Studentdetail /> }
          </>
		)
}
export default Results;
 
      

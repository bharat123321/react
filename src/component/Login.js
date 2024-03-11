import React, {useState} from 'react'
import AuthUser from'./AuthUser';
import axios from 'axios';
import Loading from './Loading.js';
import Nav_bar from '../navbar_design/Nav_bar';
import Register from '../component/Register'
import SeparateClass from '../dasboard/SeparateClass';
import {BrowserRouter , Routes , Route,Link} from 'react-router-dom'
import { Button, Col, Container, Modal, Row } from "react-bootstrap";

function CustomModal({ show, onHide }) {
    const joinclass=()=>{
        window.location.href="/join";
    }
    const createclass=()=>{
        window.location.href="/create"
    }
  return (
    <Modal show={show} onHide={onHide} backdrop="static">
  <Modal.Body>Select Class</Modal.Body>
  <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', gap: '10px' }}>
      <Button variant="primary" onClick={joinclass}>Join Class</Button>
      <Button variant="success" onClick={createclass}>Create Class</Button>
    </div>
    <div style={{ display: 'flex', gap: '10px' }}>
      <Button variant="secondary" onClick={onHide}> Close</Button>
    </div>
  </Modal.Footer>
</Modal>

  );
}
function Login()
{
 
    const {http,setToken} = AuthUser();
   // const [token, setToken] = useState();
    const[email,setEmail] = useState();
    const[password,setPassword]=useState();
    const data = {email:email,password:password}
     const[InputErrorList,setInputErrorList] = useState({});
    const[loading,setLoading] = useState(false)
   const [show, setShow] = useState(false);
  const handleClose = () =>{
 
 setShow(false);
 window.location.href="/home";
  } 
   
    const submitForm = ()=> {
        
         setLoading(true);
         //axios.post('http://127.0.0.1:8000/api/login',data).then(res=>{
            http.post('/login',data).then((res)=>{
                console.log(res.data)
               setToken(res.data.user,res.data.access_token);
            setLoading(false);
           
            if(res.data.first_time_login==1)
            {
                 setShow(true);
               
            }
            else{
               window.location.href = '/home'; 
            }

              
        }).catch(function(error){
            if(error.response){
                if(error.response.status === 422){
          setInputErrorList(error.response.data.errors)
                }
            }
        });
    }
	return(
   <>
        <Nav_bar />
    <div className="container">
    <div className="row justify-content-center">
        <div className="col-md-6">
            <div className="card">
                <div className="card-header">Login</div>

                <div className="card-body">
         
  <div className="form-group">
    <label htmlFor="email">Email address:</label>
    <input type="email" className="form-control" onChange={e=>setEmail(e.target.value)} placeholder="Email" id="email"/>
    <span className="text-danger">{InputErrorList.email}</span> 
  </div>
  <div className="form-group">
    <label htmlFor="pwd">Password:</label>
    <input type="password" className="form-control"onChange={e=>setPassword(e.target.value)} placeholder="Password" id="pwd"/>
    <span className="text-danger">{InputErrorList.password}</span> 
  </div>
  <div className="checkbox">
  <label> <input type="checkbox" className="incenter"/>  Remember me</label>
  </div>
  <button   onClick={submitForm} className="btn btn-success">Submits</button>
 
      </div>
      </div>
      </div>
    </div>
       </div>
       <CustomModal show={show} onHide={handleClose} />
	</>
    	)
}

export default Login
import React, { useState,useRef } from 'react';
import Auth from '../navbar_design/Auth';
import { Card, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import AuthUser from '../component/AuthUser';
import {Link} from "react-router-dom";
function CreateClass() {
    const {http} = AuthUser();
     const [generatedCode, setGeneratedCode] = useState(generateRandomCode(10)); // Generate the random code and store it in state
    const [userCode, setUserCode] = useState(''); // State to store the user's entered code
    const [files,setFiles] =useState(null);
    const [showAlert, setShowAlert] = useState(false); // State to control the display of the alert
    const[ subjectname ,Subjectname]=useState("");
    const data ={userCode:userCode,subjectname:subjectname};
    const inputRef = useRef();
    // Function to generate a random code
    function generateRandomCode(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomCode = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomCode += characters[randomIndex];
        }
        return randomCode;
    }

    // Function to handle user input change
    function handleUserCodeChange(event) {
        setUserCode(event.target.value);
    }
      const handlerefersh=()=>{
        window.location.reload();
      }
    // Function to handle form submission
    function handleSubmit(event) {
        event.preventDefault();
        // Compare generated code with user input
        if (generatedCode === userCode) {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
             http.post('/classcode',data,{
  headers: {
    'Content-Type': 'multipart/form-data',
     'X-CSRF-TOKEN': csrfToken
  }
}).then((res) => {
    console.log(res.data.code);
   
  });
            // Code matches
            setShowAlert(true); // Show success alert
            alert('SuccessFully insert');
            setUserCode('');
        } else {
            // Code does not match
            setShowAlert(false); // Hide success alert
            
        }
    }
 function handleGenerateCode() {
        setGeneratedCode(generateRandomCode(10)); // Update the generated code state with a new random code
    }
const handleDragOver=(event)=>{
    event.preventDefault();
 console.log(event);
}
const handleDrop=(event)=>{
    event.preventDefault();
    console.log(event);
    setFiles(event.dataTransfer);
}
    return (
        <>
             
            <Card style={{ margin: '0px 10% 0px' }}>
                <Card.Header>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link as={Link} className="btn btn-outline-white mr-3" to="/create" style={{ cursor: 'pointer' }}><h3>Create Class</h3></Link>
                        <Link as={Link} to="/join"className="btn btn-outline-dark mr-3" style={{ cursor: 'pointer' }}>Join Class</Link>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Card.Title>Generated Code: {generatedCode}<img src="./image/nextimage.jpg" onClick={handleGenerateCode} style={{cursor:'pointer',position:'relative',left:'20px',width:'20px'}}/></Card.Title>
                    <Form onSubmit={handleSubmit}>
                    <div className="form-group">
                   
                        <InputGroup className="mb-3">

                            <InputGroup.Text>Enter Code</InputGroup.Text>
                            <Form.Control 
                                aria-label="Enter Code" 
                                value={userCode} 
                                onChange={handleUserCodeChange} 
                                required 
                            />
                        </InputGroup>
                         <label htmlFor="subjectname">
                    Subject Name</label>
                    <input type="text" placeholder="Write Subject Name"className="form-control" value={subjectname} onChange={(e)=>Subjectname(e.target.value)} required/>
                      </div>
                      <br/>
                       <div className="dragdrop" onDragOver={handleDragOver} onDrop={handleDrop}><h1>Drag and Drop Files to Upload</h1>
                      <h1>Or</h1>
                      <input type='file' onChange={(e)=>setFiles(e.target.files)} multiple hidden ref={inputRef} />
                      <button onClick={()=>inputRef.current.click()}>Select Files</button>
                      
                      </div>
                                        
                      

                        <Button variant="primary" type="submit">Submit</Button>
                    </Form>
                    {showAlert && (
                        <Alert variant="success" className="mt-3">
                            Code entered correctly!
                        </Alert>
                    )}
                     {!showAlert && (
                        <Alert variant="danger" className="mt-3">
                           The entered code does not match the generated code. Please try again
                        </Alert>
                    )}
                </Card.Body>
                <Card.Footer className="text-muted">
                    Don't Share This Code With Unknown Users (Used For Educational Purposes Only)
                </Card.Footer>
            </Card>
        </>
    );
}

export default CreateClass;

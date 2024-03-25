import React,{useState,useEffect} from 'react';
import Auth from '../navbar_design/Auth';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import AuthUser from '../component/AuthUser';
function Home() {

    useEffect(()=>{
      
          fetchdata();
    },[]);
    const {http} = AuthUser();
    const fetchdata = ()=>{
        http.get('/fetchdata').then((res)=>{
            
        })
    }
    
    return (
        <>
            
            <Card style={{ margin: '0px 10% 0px' }}>
                <Card.Header>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ cursor: 'pointer' }}>Notes</h4>
                        <h5 style={{ cursor: 'pointer' }}>Download</h5>
                    </div>
                </Card.Header>
                <Card.Header className="text-muted">2 days ago</Card.Header>
                <Card.Body>
                 <Card.Img variant="bottom" src="./logo192.png" style={{ width: "40%", margin: "auto", display: "block" }}/>
                 <br/>
                    <Button variant="primary">Go somewhere</Button>
                </Card.Body>

                
            </Card>
        </>
    )
}

export default Home;

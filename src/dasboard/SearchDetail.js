// src/components/SearchDetail.js
import React,{useEffect} from 'react';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import AuthUser from '../component/AuthUser';
const SearchDetail = () => {
  const { id } = useParams();
  const {http} = AuthUser();
  useEffect(()=>{
      fetchsearchdata();
  },[]);
   const fetchsearchdata = ()=>{
    http.get(`/searchdetail/${id}`).then((res)=>{
    console.log(res.data);
    }).catch((error)=>{
      console.log(error);
    })
   }
  return (
   <Card style={{marginTop:"140px"}}>
      <Card.Header>
        <Nav variant="pills">
          <Nav.Item>
            <Nav.Link className="nav-link">For you</Nav.Link>
          </Nav.Item>
        </Nav>
      </Card.Header>
      <Card.Body>
        <Card.Text>

        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default SearchDetail;

 
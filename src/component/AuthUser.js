

 import axios from 'axios';
import {useState} from 'react';
  
export default function AuthUser(){
     
 const getToken = ()=> {
     const tokenString = localStorage.getItem('token');
     const userToken = JSON.parse(tokenString);
     return userToken;
 }
 const getUser = ()=>{
     const userString = localStorage.getItem('user');
     const user_detail = JSON.parse(userString);
     return user_detail;
 }
 const [token,setToken]=useState(getToken());
 const[user,setUser]=useState(getUser());
 const saveToken = (user,token)=>{
     localStorage.setItem('token',JSON.stringify(token));
     localStorage.setItem('user',JSON.stringify(user));
     setToken(token);
     setUser(user);

       
 }
     
 const logout = () => {
        localStorage.clear(); // Clear session data
        setToken(null); // Clear token state
         window.location.href = '/login';
    };
     const http = axios.create({
     baseURL:"http://127.0.0.1:8000/api/",
     method:'POST',
     headers :{
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`
     }

 });  
 return{
     setToken:saveToken,
     token,
     user,
     getToken,
      http,
      logout
 }
}
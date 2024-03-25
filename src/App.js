import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthUser from './component/AuthUser';
import Nav_bar from './navbar_design/Nav_bar';
import Auth from './navbar_design/Auth';
import Home from './dasboard/Home'; 
import JoinClass from './dasboard/JoinClass';
import CreateClass from './dasboard/CreateClass';
import Notification from './dasboard/Notification';
import Chat from './dasboard/Chat';
import Result from './dasboard/Results';
import Desgin_login from './dasboard/Desgin_login';
import Design_dashboard from './dasboard/Design_dashboard';
import Studentdetail from './Result/Studentdetail';
import Login from './component/Login'; // Import your Login component
import Register from './component/Register'; // Import your Register component
import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import axios from 'axios';
import UserProfile from './profile/Userprofile'
import './App.css'
import SubjectComponent from './Class/SubjectComponent'
function App() {
    const { getToken } = AuthUser();
    const [loggedIn, setLoggedIn] = useState(!!getToken());

   
 
    return (

        <Router>
         {!getToken() ?(
         <Nav_bar />)
    :( 
        <Auth />
              )}
             <Routes>

                {/* Public routes */}
                {!loggedIn && (
                    <>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </>
                )}
                {/* Public routes */}
                {loggedIn && (
                    <>
                        <Route path="/:subjectname" element={<SubjectComponent />} /> {/* Route for SubjectComponent */}
                        <Route path="/home" element={<Home />} />
                        <Route path="/join" element={<JoinClass />} />
                         <Route path="/create" element={<CreateClass />} />
                        <Route path="/notification" element={<Notification />}/>
                        <Route path="/chat" element ={<Chat />} />
                        <Route path="/results" element={<Result />}/>
                        <Route path="/studentdetail" element={<Studentdetail />}/>
                         <Route path="/profile" element ={<UserProfile/>}/>
                         
                    </>
                )}
                {/* Protected routes */}
                {loggedIn ? (
                    <Route path="/" element={<Home/>}>
                    </Route>
                ) : (
                    <Route path="/" element={<Desgin_login />} />          
                )}

                {/* Redirect to home if logged in */}
                {loggedIn && <Route path="*" element={<Navigate to="/" replace />} />}
                
                {/* Redirect to login if not logged in */}
                {!loggedIn && <Route path="*" element={<Navigate to="/" replace />} />}
            </Routes>
        </Router>
    );
}

export default App;

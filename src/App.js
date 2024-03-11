import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthUser from './component/AuthUser';
import Nav_bar from './navbar_design/Nav_bar';
import Auth from './navbar_design/Auth';
import Home from './dasboard/Home'; 
import SeparateClass from './dasboard/SeparateClass';
import Notification from './dasboard/Notification';
import Chat from './dasboard/Chat';
import Desgin_login from './dasboard/Desgin_login';
import Design_dashboard from './dasboard/Design_dashboard';
import Login from './component/Login'; // Import your Login component
import Register from './component/Register'; // Import your Register component
import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import axios from 'axios';
function App() {
    const { getToken } = AuthUser();
    const [loggedIn, setLoggedIn] = useState(!!getToken());

   useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'I') {
        localStorage.clear(); // Clear session data
         alert('checking');
         window.location.href = '/login';
          console.log('User logged out due to developer tools being opened.');
        } 
      
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

    return (
        <Router>
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
                        <Route path="/home" element={<Home />} />
                        <Route path="/class" element={<SeparateClass />} />
                        <Route path="/notification" element={<Notification />}/>
                        <Route path="/chat" element ={<Chat />} />
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
                {loggedIn && <Route path="/login" element={<Navigate to="/home" replace />} />}
                {loggedIn && <Route path="/register" element={<Navigate to="/home" replace />} />}
                
                {/* Redirect to login if not logged in */}
                {!loggedIn && <Route path="*" element={<Navigate to="/login" replace />} />}
            </Routes>
        </Router>
    );
}

export default App;

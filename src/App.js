import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthUser from './component/AuthUser';
import Nav_bar from './navbar_design/Nav_bar';
import Auth from './navbar_design/Auth';
import Home from './dasboard/Home'; 
import Desgin_login from './dasboard/Desgin_login';
import Design_dashboard from './dasboard/Design_dashboard';
import Login from './component/Login'; // Import your Login component
import Register from './component/Register'; // Import your Register component
import { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
function App() {
    const { getToken } = AuthUser();
    const [loggedIn, setLoggedIn] = useState(!!getToken());

  

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

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthUser from './component/AuthUser';
import Navbar from './navbar/Navbar';
import Auth from './navbar/Auth';
import Home from './dasboard/Home'; // Import your Home component
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

                {/* Protected routes */}
                {loggedIn ? (
                    <Route path="/" element={<Auth/>}>
                        <Route path="/home" element={<Home />} />
                    </Route>
                ) : (
                    <Route path="/" element={<Navbar />} />
                )}

                {/* Redirect to home if logged in */}
                {loggedIn && <Route path="/login" element={<Navigate to="/home" replace />} />}
                {loggedIn && <Route path="/register" element={<Navigate to="/home" replace />} />}
                
                {/* Redirect to home if no routes match */}
               {loggedIn && <Route path="*" element={<Navigate to="/home" replace />} />}
                {/* Redirect to login if not logged in */}
                {!loggedIn && <Route path="*" element={<Navigate to="/login" replace />} />}
            </Routes>
        </Router>
    );
}

export default App;

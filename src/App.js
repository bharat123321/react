import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthUser from './component/AuthUser';
import Nav_bar from './navbar_design/Nav_bar';
import Auth from './navbar_design/Auth';
import Home from './dasboard/Home'; 
import Dashboard from './dasboard/Dashboard';
import JoinClass from './dasboard/JoinClass';
import CreateClass from './dasboard/CreateClass';
import Notification from './dasboard/Notification';
import Chat from './dasboard/Chat';
import Result from './dasboard/Results';
import Book from './dasboard/Book';
import Desgin_login from './dasboard/Desgin_login';
import Index from './dasboard/Index';
import Studentdetail from './Result/Studentdetail';
import Login from './component/Login'; // Import your Login component
import Register from './component/Register'; 
import Books from './component/Books';
import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import UserProfile from './profile/Userprofile';
import UserProject from './project/UserProject';
import RenderPdf from './dasboard/RenderPdf';
import Fetchpdf from './dasboard/Fetchpdf';
import './App.css'
import SubjectComponent from './Class/JoinComponent'
import SearchDetail from './dasboard/SearchDetail'; 
import Viewbook from './dasboard/Viewbook';
import Imgtotext from './convertion/Imgtotext';
import Imgtoword from './convertion/Imgtoword';
import Searchenter from './before/Searchenter';
import Downloadbook from './dasboard/Downloadbook';
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
                        <Route path="/login" element={<Login />} exact/>
                        <Route path="/register" element={<Register />} />
                        <Route path="/collbooks" element={<Books />} />
                        <Route path="/Fetchpdf" element={<Fetchpdf/>}/>
                        <Route path="/viewbook/:id" element={<Viewbook/>}/>
                        <Route path="/imgtotext" element ={<Imgtotext/>}/>
                        <Route path="/imgtoword" element={<Imgtoword/>}/>
                        <Route path="/search/:searchTerm" element={<Searchenter />} />

                    </>
                )}
                {/* Public routes */}
                {loggedIn && (
                    <>
                       
                        <Route path="/home" element={<Dashboard />} Exact/>
                        <Route path="/join" element={<JoinClass />} Exact/>
                         <Route path="/create" element={<CreateClass />} Exact/>
                        <Route path="/notification" element={<Notification />} Exact/>
                        <Route path="/chat" element ={<Chat />} Exact/>
                        <Route path="/results" element={<Result />}/>
                        <Route path="/studentdetail" element={<Studentdetail />} Exact/>
                         <Route path="/profile" element ={<UserProfile/>} Exact/>
                         <Route path="/project" element ={<UserProject/>} Exact/>
                       <Route path="/RenderPdf" element={<RenderPdf/>}/>
                       <Route path ="/book" element={<Book/>} />
                       <Route path="/searchdetail/:id" element={<SearchDetail />} />
                      <Route path="/todownloadbook/:id" element={<Downloadbook/>} />
                         <Route path="/:subjectname" element={<SubjectComponent />} exact/>
                    </>
                )}
                {/* Protected routes */}
                {loggedIn ? (
                    <Route path="/" element={<Dashboard/>}>
                    </Route>
                ) : (
                    <Route path="/" element={<Index/>} />          
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

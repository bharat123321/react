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
import Login from './component/Login'; 
import Register from './component/Register'; 
import Books from './component/Books';
import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import UserProfile from './profile/Userprofile';
import UserProject from './project/UserProject';
import RenderPdf from './dasboard/RenderPdf';
import Fetchpdf from './dasboard/Fetchpdf';
import './App.css'
import SubjectComponent from './Class/JoinComponent';
import SearchDetail from './dasboard/SearchDetail'; 
import Viewbook from './dasboard/Viewbook';
import Imgtotext from './convertion/Imgtotext';
import Imgtoword from './convertion/Imgtoword';
import Pdftoword from './convertion/Pdftoword';
import Searchenter from './before/Searchenter';
import SearchEnter from './after/SearchEnter';
import Downloadbook from './dasboard/Downloadbook';
import BookMark from './profile/BookMark';
import File from './Admin/PostVerified';
import Upload from './User/Upload';
import './dasboard/Dashboard.css';
function App() {
    const { getToken } = AuthUser();
    const [loggedIn, setLoggedIn] = useState(!!getToken());
     console.log(getToken);
    return (
        <Router>
            {!getToken() ? <Nav_bar /> : <Auth />}
            <Routes>
                {/* Public Routes */}
                {!loggedIn && (
                    <>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/collbooks" element={<Books />} />
                        <Route path="/Fetchpdf" element={<Fetchpdf />} />
                        <Route path="/viewbook/:id" element={<Viewbook />} />
                        <Route path="/imgtotext" element={<Imgtotext />} />
                        <Route path="/imgtoword" element={<Imgtoword />} />
                        <Route path="/pdftoword" element={<Pdftoword />} />
                        <Route path="/search/:searchTerm" element={<Searchenter />} />
                    </>
                )}
                {/* Protected Routes */}
                {loggedIn && (
                    <>
                        <Route path="/home" element={<Dashboard />} />
                        <Route path="/join" element={<JoinClass />} />
                        <Route path="/create" element={<CreateClass />} />
                        <Route path="/notification" element={<Notification />} />
                        <Route path="/chat" element={<Chat />} />
                        <Route path="/results" element={<Result />} />
                        <Route path="/studentdetail" element={<Studentdetail />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/project" element={<UserProject />} />
                        <Route path="/RenderPdf" element={<RenderPdf />} />
                        <Route path="/book" element={<Book />} />
                        <Route path="/searchdetail/:id" element={<SearchDetail />} />
                        <Route path="/todownloadbook/:id" element={<Downloadbook />} />
                        <Route path="/:subjectname" element={<SubjectComponent />} />
                        <Route path="/bookmark" element={<BookMark />} />
                        <Route path="/searched/:searchTerm" element={<SearchEnter />} />
                        <Route path="/file" element={<File/>}/>
                        <Route path="/upload" element={<Upload/>}/>
                    </>
                )}
                {/* Default Route */}
                <Route path="/" element={loggedIn ? <Navigate to="/home" replace /> : <Index />} />
                {/* Redirect to home if logged in */}
                {loggedIn && <Route path="*" element={<Navigate to="/home" replace />} />}
                {/* Redirect to login if not logged in */}
                {!loggedIn && <Route path="*" element={<Navigate to="/login" replace />} />}
            </Routes>
        </Router>
    );
}

export default App;

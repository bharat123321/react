import axios from 'axios';
import { useState, useEffect } from 'react';

export default function AuthUser() {
    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        const userToken = tokenString ? JSON.parse(tokenString) : null;
        
        return userToken;
    }

    const getUser = () => {
        const userString = localStorage.getItem('user');
        const userDetail = userString ? JSON.parse(userString) : null;
        return userDetail;
    }

    const [token, setToken] = useState(getToken());
    const [user, setUser] = useState(getUser());

    const saveToken = (user, token) => {
        localStorage.setItem('token', JSON.stringify(token));
        localStorage.setItem('user', JSON.stringify(user));
        setToken(token);
        setUser(user);
    }

   // AuthUser.js
const logout = () => {
    // Clear tokens from local storage or cookies
    localStorage.removeItem('token');
    // Optionally, make a request to the server to invalidate the session
    http.post('/logout').then(() => {
      // Redirect to login page or any other page
      window.location.href = '/login';
    }).catch((error) => {
      console.error('Error during logout:', error);
      window.location.href = '/login';
    });
  };
  

    // Set the CSRF token from the meta tag
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    const http = axios.create({
        baseURL: "http://127.0.0.1:8000/api/",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
        }
    });
    
    // http.interceptors.request.use(config => {
    //     console.log('Request Headers:', config.headers);
    //     return config;
    // }, error => {
    //     return Promise.reject(error);
    // });
    
    useEffect(() => {
        http.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    }, [token]);

    return {
        setToken: saveToken,
        token,
        user,
        getToken,
        getUser,
        http,
        logout
    }
}

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

    const logout = () => {
        localStorage.clear();
        setToken(null);
        setUser(null);
        window.location.href = '/login';
    }

    // Set the CSRF token from the meta tag
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    const http = axios.create({
        baseURL: "http://127.0.0.1:8000/api/",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-CSRF-TOKEN': csrfToken // Include CSRF token in the headers
        }
    });

    useEffect(() => {
        http.defaults.headers['Authorization'] = `Bearer ${token}`;
    }, [token]);

    return {
        setToken: saveToken,
        token,
        user,
        getToken,
        http,
        logout
    }
}

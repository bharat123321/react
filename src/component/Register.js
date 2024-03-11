import React, { useState } from 'react';
import axios from 'axios';
import Loading from './Loading.js';
import Nav_bar from '../navbar_design/Nav_bar';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Register() {
    const [firstname, setFName] = useState("");
    const [lastname, setLName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");
    const [country, setCountry] = useState("");
    const [InputErrorList, setInputErrorList] = useState({});
    const [loading, setLoading] = useState(false);

    const data = { firstname, lastname, password, email, gender, address, country };

    const submitForm = () => {
        setLoading(true);
        axios.post('http://127.0.0.1:8000/api/register', data)
            .then(res => {
                alert(res.data.message);
                setLoading(false);
            })
            .catch(function (error) {
                if (error.response) {
                    if (error.response.status === 422) {
                        setInputErrorList(error.response.data.errors);
                        setLoading(false);
                    }
                    if (error.response.status === 500) {
                        alert("500");
                        console.log(error.response.data.message);
                        setLoading(false);
                    }
                }
            });
    }

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <>
            <Nav_bar />
            <div className="check_color">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-header">Register</div>
                                <div className="card-body">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="f_name">First Name</label>
                                            <input type="text" className="form-control" value={firstname} onChange={(e) => setFName(e.target.value)} placeholder="First name" />
                                            <span className="text-danger">{InputErrorList.firstname}</span>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="l_name">Lastname</label>
                                            <input type="text" className="form-control" value={lastname} onChange={(e) => setLName(e.target.value)} placeholder="Last name" />
                                            <span className="text-danger">{InputErrorList.lastname}</span>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group ">
                                            <label htmlFor="inputEmail4">Email</label>
                                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} id="inputEmail4" placeholder="Email" />
                                            <span className="text-danger">{InputErrorList.email}</span>
                                        </div>
                                        <div className="form-group  ">
                                            <label htmlFor="inputPassword4">Password</label>
                                            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} id="inputPassword4" placeholder="Password" />
                                            <span className="text-danger">{InputErrorList.password}</span>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="form-group">Gender</label>
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                value="male"
                                                checked={gender === "male"}
                                                onChange={(e) => setGender(e.target.value)}
                                                name="gender"
                                            />
                                            <label htmlFor="form-check-label">Male</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                value="female"
                                                checked={gender === "female"}
                                                onChange={(e) => setGender(e.target.value)}
                                                name="gender"
                                            />
                                            <label htmlFor="form-check-label">Female</label>
                                        </div>
                                        <span className="text-danger">{InputErrorList.gender}</span>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="inputAddress">Address</label>
                                        <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} id="inputAddress" placeholder="1234 Main St" />
                                        <span className="text-danger">{InputErrorList.address}</span>
                                    </div>
                                    <div className="form-group ">
                                        <label htmlFor="country">Country</label>
                                        <input type="text" className="form-control" value={country} onChange={(e) => setCountry(e.target.value)} id="country" placeholder="Apartment, studio, or floor" />
                                        <span className="text-danger">{InputErrorList.country}</span>
                                    </div>
                                    <button onClick={submitForm} className="btn btn-primary">Signin</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Register;

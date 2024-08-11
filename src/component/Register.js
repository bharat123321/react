import React, { useState } from 'react';
import axios from 'axios';
import { Spinner, Alert } from "react-bootstrap";
import LoadingBar from 'react-top-loading-bar';

function Register() {
    const [firstname, setFName] = useState("");
    const [lastname, setLName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");
    const [country, setCountry] = useState("");
    const [inputErrorList, setInputErrorList] = useState({});
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const data = { firstname, lastname, password, email, gender, address, country };

    const submitForm = (event) => {
        event.preventDefault();
        setLoading(true);

        // Validate firstname and lastname
        const errors = {};
        const startsWithNumber = /^[0-9]/;

        if (startsWithNumber.test(firstname)) {
            errors.firstname = "Firstname invalid.";
        }
        if (startsWithNumber.test(lastname)) {
            errors.lastname = "Lastname invalid.";
        }

        if (Object.keys(errors).length > 0) {
            setInputErrorList(errors);
            setLoading(false);
            return;
        }

        axios.post('http://127.0.0.1:8000/api/register', data)
            .then(res => {
                setProgress(70); // Intermediate progress
                alert(res.data.message);
                // Reset form fields
                setFName("");
                setLName("");
                setPassword("");
                setEmail("");
                setGender("");
                setAddress("");
                setCountry("");
                setInputErrorList({}); // Clear input errors
                setLoading(false);
                setProgress(100); // Complete loading progress
            })
            .catch(error => {
                setLoading(false);
                setProgress(100); 
                if (error.response) {
                    if (error.response.status === 422) {
                        setInputErrorList(error.response.data.errors);
                    }
                    if (error.response.status === 500) {
                        alert("An error occurred on the server. Please try again later.");
                        console.error(error.response.data.message);
                    }
                }
            });
    };

    return (
        <>
            <LoadingBar
                color='#f11946'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            <div className="check_color">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-header">Register</div>
                                <div className="card-body">
                                    <form onSubmit={submitForm}>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="f_name">First Name</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    value={firstname} 
                                                    onChange={(e) => setFName(e.target.value)} 
                                                    placeholder="First name" 
                                                />
                                                <span className="text-danger">{inputErrorList.firstname}</span>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="l_name">Last Name</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    value={lastname} 
                                                    onChange={(e) => setLName(e.target.value)} 
                                                    placeholder="Last name" 
                                                />
                                                <span className="text-danger">{inputErrorList.lastname}</span>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group ">
                                                <label htmlFor="inputEmail4">Email</label>
                                                <input 
                                                    type="email" 
                                                    className="form-control" 
                                                    value={email} 
                                                    onChange={(e) => setEmail(e.target.value)} 
                                                    id="inputEmail4" 
                                                    placeholder="Email" 
                                                />
                                                <span className="text-danger">{inputErrorList.email}</span>
                                            </div>
                                            <div className="form-group  ">
                                                <label htmlFor="inputPassword4">Password</label>
                                                <input 
                                                    type="password" 
                                                    className="form-control" 
                                                    value={password} 
                                                    onChange={(e) => setPassword(e.target.value)} 
                                                    id="inputPassword4" 
                                                    placeholder="Password" 
                                                />
                                                <span className="text-danger">{inputErrorList.password}</span>
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
                                            <span className="text-danger">{inputErrorList.gender}</span>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="inputAddress">Address</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                value={address} 
                                                onChange={(e) => setAddress(e.target.value)} 
                                                id="inputAddress" 
                                                placeholder="1234 Main St" 
                                            />
                                            <span className="text-danger">{inputErrorList.address}</span>
                                        </div>
                                        <div className="form-group ">
                                            <label htmlFor="country">Country</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                value={country} 
                                                onChange={(e) => setCountry(e.target.value)} 
                                                id="country" 
                                                placeholder="Country" 
                                            />
                                            <span className="text-danger">{inputErrorList.country}</span>
                                        </div>
                                        <button className="btn btn-primary" disabled={loading}>Register</button>
                                        {loading && <Spinner animation="border" role="status" className="ml-2"><span className="sr-only"></span></Spinner>}
                                    </form>
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

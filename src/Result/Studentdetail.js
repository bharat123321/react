import Auth from "../navbar_design/Auth";

const Studentdetail = () => {
    return (
        <>
            
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 border p-4"style={{ boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)', background: '#f8f9fa' }}>
                        <form>
                            <div className="form-group">
                                <label htmlFor="inputstdname">Student Name</label>
                                <input type="text" className="form-control" id="inputstdname" placeholder="Student Name" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputguardian">Guardian Name</label>
                                <input type="text" className="form-control" id="inputguardian" placeholder="Guardian Name" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputAddress">Address</label>
                                <input type="text" className="form-control" id="inputAddress" placeholder="1234 Main St" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputcontactnumber">Contact Number</label>
                                <input type="text" className="form-control" id="inputcontactnumber" placeholder="Contact Number" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleFormControlSelect1">Select Grade</label>
                                <select className="form-control" id="exampleFormControlSelect1">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                    <option>6</option>
                                    <option>7</option>
                                    <option>8</option>
                                    <option>9</option>
                                    <option>10</option>
                                    <option>11</option>
                                    <option>12</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Studentdetail;

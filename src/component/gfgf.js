<div className="form-group">
    <label htmlFor="l_name">Lastname</label>
      <input type="text" className="form-control" placeholder="Last name"/>
    </div>
   <label htmlFor="form-group">Gender</label>
  <div className="form-check">
  <label htmlFor="form-check-label">
    <input type="radio" className="form-check-input" name="gender"/>Male
  </label>
</div>

<div className="form-check">
  <label htmlFor="form-check-label">
    <input type="radio" className="form-check-input" name="gender"/>Female
  </label>
</div>
  <div className="form-group">
    <label htmlFor="inputAddress">Address</label>
    <input type="text" className="form-control" id="inputAddress" placeholder="1234 Main St"/>
  </div>
  <div className="form-group ">
    <label htmlFor="country">Country 2</label>
    <input type="text" className="form-control" id="country" placeholder="Apartment, studio, or floor"/>
  </div>
  if(error.response)
        {
         if(error.response.status === 422){
          setInputErrorList(error.response.data.errors)
          console.log(error.response.errors);
          alert("422");
         }
         if(error.response.status === 500){
           alert("500");
           console.log(error.response.message);
         }
        }
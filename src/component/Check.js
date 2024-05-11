import { useEffect, useState } from 'react';
import AuthUser from './AuthUser';

const Check = () => {
  const [userRole, setUserRole] = useState('');
  const { http } = AuthUser();

  const handleUserType = () => {
     localStorage.setItem('UserType',"student");
    //  http.get('/userType/').then((res) => {
    //   console.log(res.data);
    //   localStorage.setItem('UserType', res.data);
    //   if (res.data === "admin") {
    //     window.location.href = "/admin";
    //   }
    //   if (res.data === "teacher") {
    //     window.location.href = "/teacher";
    //   }
    //   if (res.data === "student") {
    //     window.location.href = "/student";
    //   }
    // }).catch((error) => {
    //   console.log(error);
    // });
  }
  useEffect(()=>{
    handleUserType();
  },[]);
     
  }

 

export default Check;    
 

import React, { useState } from 'react';
import axios from 'axios';
import AuthUser from './AuthUser';
const VerifyEmail = () => {
     const { http, setToken } = AuthUser();
  const [resending, setResending] = useState(false);
  const resendVerificationEmail = async () => {
    setResending(true);
    try {
      await  http.post('/email/resend');
      alert('Verification link has been resent!');
    } catch (error) {
      alert('Failed to resend the verification email.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div>
      <h1>Verify your email</h1>
      <p>Please check your inbox and click the verification link.</p>
      <button onClick={resendVerificationEmail} disabled={resending}>
        Resend Verification Email
      </button>
    </div>
  );
};

export default VerifyEmail;

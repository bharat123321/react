import React, { useState } from 'react';
import axios from 'axios';
import './SecurityCode.css';
const SecurityCode = ({ email }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleCodeSubmit = async () => {
    try {
      const response = await axios.post('http://your-laravel-backend-url/api/verify-code', {
        email,
        code,
      });
      if (response.data.success) {
        setShowPasswordChange(true);
      } else {
        setError('Invalid code. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const response = await axios.post('http://your-laravel-backend-url/api/update-password', {
        email,
        newPassword,
      });
      if (response.data.success) {
        alert('Password updated successfully.');
      } else {
        setError('Failed to update password. Please try again.');
      }
    } catch (error) {
      setError('An error occurred while updating the password.');
    }
  };

  return (
    <div className="security-code-container">
      {!showPasswordChange ? (
        <>
          <h3>Enter security code</h3>
          <p>
            Please check your email for a message with your code. Your code is 6 numbers long.
          </p>
          <input
            type="text"
            placeholder="Enter code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button onClick={handleCodeSubmit}>Continue</button>
          {error && <p className="error-message">{error}</p>}
        </>
      ) : (
        <>
          <h3>Change Password</h3>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button onClick={handlePasswordChange}>Update Password</button>
          {error && <p className="error-message">{error}</p>}
        </>
      )}
    </div>
  );
};

export default SecurityCode;

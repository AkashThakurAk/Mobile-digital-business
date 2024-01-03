import React, { useState } from 'react';
import { redirect, useParams } from "react-router-dom";
import axios from 'axios';

const ResetPassword = () => {
  const { email, token } = useParams()

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email is ", email)
    console.log("Token is ", token)
    // Check if passwords match
    if (password === confirmPassword) {
      try {

        const response = await axios.post("http://localhost:2000/reset-password", {
          password: password,
          email: email,
          token: token,
        });
        console.log("Hello")
        // Check the status within the response
        if (response.status === 200) {
          setMessage('Password updated successfully!');
          redirect("/login");
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setMessage(error.response.data.message);
        } else {
          setMessage('Something went wrong');
          console.error('Error: ', error);
        }
      }
    } else {
      setMessage('Passwords do not match. Please try again.');
    }
  };

  return (
    <div className=" c-login-dive c-new-sign-up c-bg_pic">
      <div className='c-mobile_body'>
        <div>
          <div className="star-field">
            <div className="layer"></div>
            <div className="layer"></div>
            <div className="layer"></div>
          </div>
        </div>
        <div className="c-login_des">
          <form onSubmit={handleSubmit}>
            <div className="c-mobile_text">
              <h2>Reset Password</h2>
            </div>
            <div className="c-input-box">
              <label htmlFor="psw"><b>Password</b></label>
              <input type="password" placeholder="Enter Password" name="password"  onChange={handlePasswordChange} required />

              <label htmlFor="confirmPsw"><b>Confirm Password</b></label>
              <input type="password" placeholder="Confirm Password" name="confirmpassword"  onChange={handleConfirmPasswordChange} required />


              {message && (
                <p style={{ color: "red" }}>{message}</p>
              )}
              <button type="submit">Submit</button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

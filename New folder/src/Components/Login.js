import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errmsg, setErrmsg] = useState('');

    const redirect = useNavigate();

    const handlelogin = async (e) => {
        e.preventDefault();
        if (email === "" || password === "") {
            setErrmsg("Enter Full Details")
            return;
        } else {
            try {
                const response = await axios.post("http://localhost:2000/login", {
                    email: email,
                    password: password,
                })
                if (response.status === 200) {
                    setErrmsg(response.data.message)
                    window.localStorage.setItem("loginuser", email);

                    if (response.data.message === "client") {
                        redirect("/user");
                    }
                    else if (response.data.message === "admin") {
                        redirect("/admin")
                    }

                    // redirect("/profile");
                }

            } catch (error) {
                if (error.response && error.response.status === 400) {
                    setErrmsg(error.response.data.message);
                } else {
                    setErrmsg("Something went wrong");
                    console.error("Error: ", error);
                }
            }
        }
    }

    return (
        <div className=" c-login-dive c-new-sign-up">
            <div className='c-mobile_body'>
                <div>
                    <div className="star-field">
                        <div className="layer"></div>
                        <div className="layer"></div>
                        <div className="layer"></div>
                    </div>
                </div>
                <div className="c-login_des">
                    <form>
                        <div className="c-mobile_text">
                            <h2>Welcome Back</h2>
                            <p>Please Enter Your Email and Password</p>
                        </div>
                        <div className="c-input-box">
                            <label htmlFor="email"><b>Email</b></label>
                            <input type="email" placeholder="Enter Email" name="email" onChange={(e) => (setEmail(e.target.value))} required />

                            <label htmlFor="psw"><b>Password</b></label>
                            <input type="password" placeholder="Enter Password" name="psw" onChange={(e) => (setPassword(e.target.value))} required />
                            {errmsg && (
                                <p style={{ color: "red" }}>
                                    {setErrmsg}
                                </p>
                            )}
                            {errmsg && (
                                <p style={{ color: "red" }}>{errmsg}</p>
                            )}
                            <button onClick={handlelogin}>Login</button>
                        </div>
                        <div className="c-forget-pas">
                            <span className="psw"><a href="#">Forgot password?</a></span>
                        </div>
                        <div className="c-forget-pas">
                            <span className='' >Don't have an account?
                                <Link to="/signup" className=''>
                                    Sign Up
                                </Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;

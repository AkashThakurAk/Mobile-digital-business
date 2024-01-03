import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function SignUp() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [cpassword, setCPassword] = useState("")
    const [errmsg, setErrmsg] = useState('');
    // const [cpassword, setCPassword] = useState("")



    const redirect = useNavigate();

    const handlesignup = async (e) => {
        e.preventDefault();
        if (name === "" || email === "" || password === "" || cpassword === "") {
            setErrmsg("Enter Full Details")
            return;
        } else if (password !== cpassword) {
            setErrmsg("Password Does Not Match");
            return; // Exit the function early if passwords don't match
        }
        else {
            try {
                const response = await axios.post("http://localhost:2000/signup", {
                    email: email,
                    password: password,
                    name: name,
                })

                // Check the status within the response
                if (response.status === 200) {
                    setErrmsg("SIGNUP SUCCESSFUL");
                    window.localStorage.setItem("loginemail", email);
                    redirect("/profile");
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
    };

    return (
        <div className=" c-login-dive c-new-sign-up" >
            <div className='c-mobile_body'>
                <div>
                    <div className="star-field">
                        <div className="layer"></div>
                        <div className="layer"></div>
                        <div className="layer"></div>
                    </div>
                </div>
                <div className="c-login_des">
                    <form >
                        <div className="c-mobile_text">
                            <h2>Welcome</h2>
                            <p>Please Enter Your Details</p>
                        </div>
                        <div className="c-input-box">
                            <label htmlFor="name"><b>Name</b></label>
                            <input type="text" placeholder="Enter Name" name="name" onChange={(e) => (setName(e.target.value))} required />

                            <label htmlFor="email"><b>Email</b></label>
                            <input type="email" placeholder="Enter Email" name="email" onChange={(e) => (setEmail(e.target.value))} required />

                            <label htmlFor="psw"><b>Password</b></label>
                            <input type="password" placeholder="Enter Password" name="password" onChange={(e) => (setPassword(e.target.value))} required />

                            <label htmlFor="confirmPsw"><b>Confirm Password</b></label>
                            <input type="password" placeholder="Confirm Password" name="confirmpassword" onChange={(e) => (setCPassword(e.target.value))} required />
                            {errmsg && (
                                <p style={{ color: "red" }}>
                                    {setErrmsg}
                                </p>
                            )}
                            {errmsg && (
                                <p style={{ color: "red" }}>{errmsg}</p>
                            )}

                            <button onClick={handlesignup}>Sign Up</button>
                        </div>
                        <div className="c-forget-pas">
                            <span className='' >Have an account?
                                <Link to="/login" className=''>
                                    Login
                                </Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div >
        </div>
    );
}

export default SignUp;

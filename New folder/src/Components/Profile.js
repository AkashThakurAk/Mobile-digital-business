import React from 'react';
import user from "../Assets/images/user.jpg";
import { useState } from 'react';
import QRCode from "react-qr-code";
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import download from 'downloadjs';
import axios from 'axios';


function Profile() {

    console.log(`login user is on profile page  ${localStorage.getItem("loginuser")}`);

    const [username, setUsername] = useState();
    // const [profilepic, setProfilepic] = useState();
    const [fullname, setFullname] = useState();
    const [companyname, setCompanyname] = useState();
    const [title, setTitle] = useState();
    const [website, setWebsite] = useState();
    const [number, setNumber] = useState();
    const [email, setEmail] = useState();
    const [linkdin, setLinkdin] = useState();
    const [facebook, setFacebook] = useState();
    const [instagram, setInstagram] = useState();
    const [errmsg, setErrmsg] = useState();

    const loginemail = localStorage.getItem("loginuser");
    console.log(`login email is on profile page  ${loginemail}`);


    const isValidURL = (url) => {
        const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        return urlRegex.test(url);
    };

    const handleWebsiteChange = (e) => {
        const enteredURL = e.target.value.trim();
        if (isValidURL(enteredURL)) {
            setWebsite(enteredURL);
        } else {
            setErrmsg('Enter a valid website URL');
        }
    };

    const handleLinkdinChange = (e) => {
        const enteredURL = e.target.value.trim();
        if (isValidURL(enteredURL)) {
            setLinkdin(enteredURL);
        } else {
            setErrmsg('Enter a valid LinkedIn URL');
        }
    };

    const handleFacebookChange = (e) => {
        const enteredURL = e.target.value.trim();
        if (isValidURL(enteredURL)) {
            setFacebook(enteredURL);
        } else {
            setErrmsg('Enter a valid Facebook URL');
        }
    };

    const handleInstagramChange = (e) => {
        const enteredURL = e.target.value.trim();
        if (isValidURL(enteredURL)) {
            setInstagram(enteredURL);
        } else {
            setErrmsg('Enter a valid Instagram URL');
        }
    };

    const [profileImage, setProfileImage] = useState(user);
    const [qrValue, setQrValue] = useState("placeholding");
    const [qrname, setqrname] = useState();
    const [isVisible, setIsvisible] = useState(null);
    const qrCodeRef = useRef(null);


    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

            if (!allowedExtensions.exec(file.name)) {
                // Display an error message or handle the invalid file type here
                alert('Invalid file type. Please select an image file.');
                event.target.value = ''; // Clear the file input
            } else {
                console.log('Valid image selected:', file);
                setProfileImage(URL.createObjectURL(file));
            }
        }
        const profileImage = document.getElementById('imag');
        // Check if a file is selected
        if (event.target.files.length > 0) {
            // Clear previous content
            profileImage.innerHTML = '';
            const img = document.createElement('img');
            img.src = URL.createObjectURL(event.target.files[0]);
            profileImage.appendChild(img);
        }
    };



    const handleSubmit = async (e) => {
        // console.log("Handle Submit ")
        e.preventDefault();

        const file = document.getElementById('getpic').files[0];

        if (
            !profileImage ||
            !username ||
            !fullname ||
            !companyname ||
            !title ||
            !website ||
            !number ||
            !email ||
            !linkdin ||
            !facebook ||
            !instagram
        ) {
            setErrmsg("Enter Full Details");
            return;
        }
        else {
            try {
                const formData = new FormData();

                formData.append('username', username);
                formData.append('profileImage', file);
                formData.append('fullname', fullname);
                formData.append('companyname', companyname);
                formData.append('title', title);
                formData.append('website', website);
                formData.append('number', number);
                formData.append('email', email);
                formData.append('linkdin', linkdin);
                formData.append('facebook', facebook);
                formData.append('instagram', instagram);
                formData.append('loginuser', loginemail);

                const response = await axios.post("http://localhost:2000/update", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },

                });

                if (response.status === 200) {
                    setErrmsg("Data Submitted Successfully");
                    // console.log("Data Submitted Successfully");
                    const user_name = username.split(' ')[0];
                    const Website = `xava.co.in/virtualcard/${user_name}`;
                    e.preventDefault();
                    setqrname(user_name);
                    setQrValue(Website);
                    setIsvisible(true);
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

    const handleDownload = (e) => {
        e.preventDefault();
        console.log("qr download ");
        const qrCodeContainer = qrCodeRef.current;
        if (qrCodeContainer) {
            const captureOptions = {
                useCORS: true,
                width: qrCodeContainer.offsetWidth,
                height: qrCodeContainer.offsetHeight,
                scrollY: -window.scrollY,
            };

            const clonedContainer = qrCodeContainer.cloneNode(true);
            const nameElement = clonedContainer.querySelector('.q-name');
            nameElement.style.textAlign = 'center';

            html2canvas(qrCodeContainer, captureOptions)
                .then((canvas) => {

                    const dataUrl = canvas.toDataURL('image/png');


                    download(dataUrl, 'qrcode.png', 'image/png');
                })
                .catch((error) => {
                    console.error('Error capturing QR code:', error);
                });
        }
    };

    return (
        <div className="c-login-dive c-new-sign-up" >
            <div className='c-mobile_body c-profile_page'>
                <div>
                    <div className="star-field">
                        <div className="layer"></div>
                        <div className="layer"></div>
                        <div className="layer"></div>
                    </div>
                </div>
                <div className="c-login_des c-profile_des">

                    <form >

                        <div className="c-mobile_text">
                            <h2>Welcome</h2>
                            <p>Please Enter Your Details</p>
                        </div>
                        <div className="c-input-box">

                            <div id="profile-upload">
                                <div className="hvr-profile-img">
                                    <input
                                        type="file"
                                        name="logo"
                                        id="getpic"
                                        className="upload w180"
                                        title="Dimensions 180 X 180"
                                        onChange={(e) => {
                                            handleImageChange(e);
                                            setProfileImage(e.target.files);
                                        }}
                                        required
                                    />
                                    <i className="fa fa-camera"></i>
                                </div>
                                <div id="imag" >
                                    <img src={profileImage} />
                                </div>
                            </div>
                            <div className='c-profile_from'>
                                <div className='c-profile_input'>
                                    <label htmlFor="username"><b>User Name</b></label>
                                    <input type="text" placeholder="Enter User Name" name="username" onChange={(e) => { setUsername(e.target.value) }} required />
                                </div>
                                <div className='c-profile_input'>
                                    <label htmlFor="uname"><b>Full Name</b></label>
                                    <input type="text" placeholder="Enter Full Name" name="fullname" onChange={(e) => { setFullname(e.target.value) }} required />
                                </div>
                                <div className='c-profile_input'>
                                    <label htmlFor="uname"><b>Company Name</b></label>
                                    <input type="text" placeholder="Enter Company Name" name="company" onChange={(e) => { setCompanyname(e.target.value) }} required />
                                </div>
                                <div className='c-profile_input'>
                                    <label htmlFor="uname"><b>Title</b></label>
                                    <input type="text" placeholder="Enter Title" name="title" onChange={(e) => { setTitle(e.target.value) }} required />
                                </div>
                                <div className='c-profile_input'>
                                    <label htmlFor="website"><b>Website URL</b></label>
                                    <input type="url" placeholder="Enter Website URL" name="website" onChange={handleWebsiteChange} required />

                                </div>
                                <div className='c-profile_input'>
                                    <label htmlFor="uname"><b>Phone Number</b></label>
                                    <input type="tel" placeholder="Enter Phone Number With Country Code" name="number" onChange={(e) => { setNumber(e.target.value) }} required />
                                </div>
                                <div className='c-profile_input'>
                                    <label htmlFor="uname"><b>Email</b></label>
                                    <input type="email" placeholder="Enter Email" name="email" onChange={(e) => { setEmail(e.target.value) }} required />

                                </div>
                                <div className='c-profile_input'>
                                    <label htmlFor="linkdin"><b>Linkdin URL</b></label>
                                    <input type="url" placeholder="Enter Linkdin URL" name="linkdin" onChange={handleLinkdinChange} required />

                                </div>
                                <div className='c-profile_input'>
                                    <label htmlFor="facebook"><b>Facebok URL</b></label>
                                    <input type="url" placeholder="Enter Facebok URL" name="facebook" onChange={handleFacebookChange} required />
                                </div>
                                <div className='c-profile_input'>
                                    <label htmlFor="instagram"><b>Instagram URL</b></label>
                                    <input type="url" placeholder="Enter Instagram URL" name="instagram" onChange={handleInstagramChange} required />
                                </div>
                            </div>


                            {errmsg && (
                                <p style={{ color: "red" }}>
                                    {<p style={{ color: "red" }}>{setErrmsg}</p>
                                    }
                                </p>
                            )}
                            {errmsg && (
                                <p style={{ color: "red" }}>{errmsg}</p>
                            )}
                            <button type="submit" onClick={handleSubmit}>
                                Generate QR Code
                            </button>
                        </div>
                    </form>

                </div>
                {isVisible && (
                    <div className='c-qr'>
                        <div className='qr_code' ref={qrCodeRef}>
                            <div>
                                <p className='q-name'>{qrname}</p>
                                <QRCode
                                    value={qrValue}
                                    // style={{ display: 'block', margin: '0 auto' }}
                                    onLoad={() => handleDownload()}
                                />
                            </div>
                        </div>
                        <div className='qr_download'>
                            <button onClick={handleDownload} type='submit'>Download QR Code</button>
                        </div>
                    </div>
                )}
            </div >
        </div>
    );
}

export default Profile;


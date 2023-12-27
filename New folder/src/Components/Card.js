import React, { useEffect, useState } from 'react';
import facebookIcon from '../Assets/images/facebook.png';
import instagramIcon from '../Assets/images/instagram.png';
import linkedinIcon from '../Assets/images/linkedin.png';
import axios from 'axios';



function Card() {

    const [responsedata, setResponsedata] = useState([]);


    const pathSegments = window.location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];

    const trimmedSegment = lastSegment.trim();
    console.log(trimmedSegment);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:2000/fetch", {
                    params: {
                        user_name: trimmedSegment
                    }
                })
                if (response.status === 200) {
                    setResponsedata(response.data);
                    console.log(response.data);
                    console.log(`Pic is ${responsedata.Profile_Pic}`);
                }

            } catch (error) {
                if (error.response && error.response.status === 400) {
                    console.log(error);
                } else {
                    console.error("Error: ", error);
                }
            }
        };
        // Call fetchData when the component mounts
        fetchData();
    }, []); // Empty dependency array ensures that useEffect runs only once when the component mounts

    return (
        <div>
            {responsedata?.map((responsedata) => (
                <div>
                    <section className="c-mobile_body c-mobile_body_home c-laptop_body" id="card-container">
                        <div className="c-profile-img">
                            <img src={`/Assets/profile/${responsedata.Profile_Pic}`} alt="" />
                        </div>
                        <div className="c-bio_user">
                            <h2>{responsedata.Name}</h2>
                            <a href={responsedata.Company}>{responsedata.Company}</a>
                            <p>{responsedata.Title}</p>
                        </div>
                        <div className="c-contact_d">
                            <ul>
                                <li><a href={`tel:${responsedata.Number}`}><i className="fa-solid fa-mobile-screen"></i></a></li>
                                <li><a href={`mailto:${responsedata.Email}`}><i className="fa-regular fa-envelope"></i></a></li>
                                <li><a href={responsedata.Website_Link} target='_blank'><i className="fa-brands fa-chrome"></i></a></li>
                            </ul>
                        </div>
                        <div className="c-social_list">
                            <ul>
                                <li>
                                    <a href={responsedata.Linkdin_Link} target='_blank'>
                                        <p className="c-social_list_item">
                                            <span className="c-social_list_img">
                                                <img src={linkedinIcon} alt="" />
                                            </span>
                                            <span className="c-social_list_name">
                                                <span className="c-social_list_heading">
                                                    linkedin
                                                </span>
                                                <span className="c-social_list_pa">
                                                    follow on linkedin
                                                </span>
                                            </span>
                                        </p>
                                        <p className="c-social_icon"><i className="fa-solid fa-chevron-right"></i></p>
                                    </a>
                                </li>
                                <li>
                                    <a a href={responsedata.Facebook_Link} target='_blank'>
                                        <p className="c-social_list_item">
                                            <span className="c-social_list_img">
                                                <img src={facebookIcon} alt="" />
                                            </span>
                                            <span className="c-social_list_name">
                                                <span className="c-social_list_heading">
                                                    facebook
                                                </span>
                                                <span className="c-social_list_pa">
                                                    follow on facebook
                                                </span>
                                            </span>
                                        </p>
                                        <p className="c-social_icon"><i className="fa-solid fa-chevron-right"></i></p>
                                    </a>
                                </li>
                                <li>
                                    <a href={responsedata.Instagram_Link} target='_blank'>
                                        <p className="c-social_list_item">
                                            <span className="c-social_list_img">
                                                <img src={instagramIcon} alt="" />
                                            </span>
                                            <span className="c-social_list_name">
                                                <span className="c-social_list_heading">
                                                    instagram
                                                </span>
                                                <span className="c-social_list_pa">
                                                    follow on instagram
                                                </span>
                                            </span>
                                        </p>
                                        <p className="c-social_icon"><i className="fa-solid fa-chevron-right"></i></p>
                                    </a>
                                </li>
                            </ul>
                            <div className="c-add_contact-btn">
                                <a href={`contacts://add?name=${encodeURIComponent(responsedata.Name)}&phone=${encodeURIComponent(responsedata.Number)}`}>
                                    Add to contact <span><i className="fa-solid fa-circle-plus"></i></span>
                                </a>
                            </div>
                        </div>

                    </section>
                </div>

            ))}

        </div>
    );
}

export default Card;

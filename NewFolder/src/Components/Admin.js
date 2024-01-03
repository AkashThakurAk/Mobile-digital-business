import React, { useEffect, useState } from 'react'
import axios from 'axios';
// import Table from 'react-bootstrap/Table';


function Admin() {
    const [responsedata, setResponsedata] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:2000/allusers", {
                })
                if (response.status === 200) {
                    setResponsedata(response.data);
                    console.log(response.data);
                    // console.log(`Pic is ${responsedata.Profile_Pic}`);
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
    }, [])
    return (
        <>
            Admin
            <table>
                <tr>
                    <th>S.No.</th>
                    <th>User_ID</th>
                    <th>Email</th>
                    <th>Name</th>
                    <th>User_Type</th>
                </tr>
                {responsedata.map((responsedata, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{responsedata.id}</td>
                        <td>{responsedata.Email}</td>
                        <td>{responsedata.Name}</td>
                        <td>{responsedata.type}</td>
                    </tr>))}
            </table>
        </>
    )
}

export default Admin;


const express = require("express");
const mysql = require("mysql");
const fileuploader = require("express-fileupload");
const path = require("path");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

var app = express();
app.use(
    cors({
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST'],
        credentials: true,
    })
);
app.use(express.json());



app.use(express.static("public"));

app.use(express.urlencoded("true"));

app.use(fileuploader());

app.listen(2000, function () {
    console.log("Server Started");
});

//========for databas configuration=========
var dbConfig = {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "xava_bcard",
    dateStrings: true
}

//========for Databse Refer===================
var dbRef = mysql.createConnection(dbConfig);
dbRef.connect(function (err) {
    if (err == null)
        console.log("Connected Successfully");
    else
        console.log(err);
});


//===================================== SignUp Code ===========================================================

app.post("/signup", function (req, res) {
    // console.log(req.body);
    const data = [req.body.name, req.body.email, req.body.password];
    console.log(`data is ${data}`);

    dbRef.query("SELECT email from users WHERE email =?", [req.body.email], function (err, TableJsonAry) {
        if (err) {
            console.error("Error: ", err);
            res.status(500).json("Internal Server Error");
        } else {
            if (TableJsonAry.length > 0) {
                res.status(400).json({ message: "Email Already Exists" });
            } else {
                dbRef.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", data, function (err, TableJsonAry) {
                    if (err) {

                        console.error("Error: ", err);
                        res.status(500).json("Internal Server Error");
                    } else {
                        res.status(200).json("Sign Up Successful");
                        // dbRef.query("INSERT INTO userdetails (Login_Email) VALUES (?)", [req.body.email], function (err, TableJsonAry) {
                        //     if (err) {

                        //         console.error("Error: ", err);
                        //         res.status(500).json("Internal Server Error");
                        //     } else {
                        //         res.status(200).json("Sign Up Successful");
                        //     }
                        // })
                    }
                });
            }
        }
    })


});

//=================================================== Login Code =========================================================================

app.post("/login", function (req, res) {
    console.log(req.body);
    const data = [req.body.email, req.body.password];
    dbRef.query("SELECT * from users WHERE email=? and password=?", data, function (err, TableJsonAry) {
        if (err) {
            console.error("Error: ", err);
            res.status(500).json("Internal Server Error");
        }
        else if (TableJsonAry.length === 1) {
            console.log(TableJsonAry[0].type);

            res.status(200).json({ message: TableJsonAry[0].type });
        }
        else {
            res.status(400).json({ message: "Invalid Email or Password" });
        }
    })
})

//=================================================== Submit Data Code =========================================================================
// app.get("/fetchuserid", function (req, res) {
//     // const {loginemail} =  req.body.loginemail;
//     console.log("data from db is", req.body.loginemail);

//     dbRef.query("SELECT * FROM users WHERE Email=?", [req.query.loginemail], function (err, TableJsonAry) {
//         if (err)
//             res.status(400).json(err);
//         else
//             res.status(200).json(TableJsonAry);
//         console.log(TableJsonAry);
//     })
// })


app.post("/savedata", function (req, res) {
    console.log("data from frontend is 1", req.files.profileImage.name);

    let picname = "NOT UPLOADED";
    if (req.files != null) {
        picname = req.files.profileImage.name;
        console.log("File Name=" + picname);

        var des = path.join(__dirname, "public", "Assets", "profile", picname);
        req.files.profileImage.mv(des, function (err) {
            if (err)
                console.log(err);
            else
                console.log("Upload Successful");
        })//saving in uploads folder

    }

    console.log("data from frontend is 2==========", req.body);
    const data = [
        req.body.username,
        req.body.loginemail,
        picname,
        req.body.fullname,
        req.body.companyname,
        req.body.title,
        req.body.website,
        req.body.number,
        req.body.email,
        req.body.linkdin,
        req.body.facebook,
        req.body.instagram,
    ];

    dbRef.query("SELECT User_Name from userdetails WHERE User_Name =?", [req.body.username], function (err, TableJsonAry) {
        if (err) {
            console.error("Error checking existing username:", err);
            res.status(500).json("=========Internal Server Error========");
        } else if (TableJsonAry.length > 0) {
            res.status(400).json({ message: "Username Already Exists. Kindly Change It" });
        } else {
            dbRef.query("INSERT INTO userdetails (User_Name, Login_Email,Profile_Pic, Name, Company, Title, Website_Link, Number, Email, Linkdin_Link, Facebook_Link, Instagram_Link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                data, function (err, TableJsonAry) {
                    if (err) {
                        console.error("Error inserting data:", err);
                        res.status(500).json("Internal Server Error");
                    } else
                        res.status(200).json("Data Stored");
                    console.log("data inserted");
                });
        }
    });

    // const data = [

    //     req.body.username,
    //     // req.body.loginid,
    //     picname,
    //     req.body.fullname,
    //     req.body.companyname,
    //     req.body.title,
    //     req.body.website,
    //     req.body.number,
    //     req.body.email,
    //     req.body.linkdin,
    //     req.body.facebook,
    //     req.body.instagram,
    //     req.body.loginemail,
    // ];
    // dbRef.query("SELECT User_Name from userdetails WHERE User_Name =?", [req.body.username], function (err, TableJsonAry) {
    //     if (err) {
    //         console.error("Error checking existing username:", err);
    //         return res.status(500).json("=========Internal Server Error========");
    //     } else if (TableJsonAry.length > 0) {
    //         return res.status(400).json({ message: "Username Already Exists. Kindly Change It" });
    //     } else {
    //         // No existing username, proceed with insertion
    //         dbRef.query
    //             ("INSERT INTO userdetails (User_Name, Login_Email,Profile_Pic, Name, Company, Title, Website_Link, Number, Email, Linkdin_Link, Facebook_Link, Instagram_Link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    //                 data, function (err, TableJsonAry) {
    //                     if (err) {
    //                         console.error("Error inserting data:", err);
    //                         return res.status(500).json("Internal Server Error");
    //                     } else
    //                         res.status(200).json("Data Stored");
    //                 });
    //     }
    // });
});

//==================================== For Card Display Code =============================================================

app.get("/fetch", function (req, res) {
    console.log(`data from db is ${req.body}`);
    dbRef.query("SELECT * FROM userdetails WHERE User_Name=?", [req.query.user_name], function (err, TableJsonAry) {
        if (err)
            res.status(400).json(err);
        else
            res.status(200).json(TableJsonAry);
    })

})
//=================================================== Update Data Code =========================================================================
app.get("/fetchdata", function (req, res) {

    dbRef.query("SELECT * FROM userdetails WHERE Login_Email=?", [req.query.loginemail], function (err, TableJsonAry) {
        if (err)
            res.status(400).json(err);
        else
            res.status(200).json(TableJsonAry);
        console.log(TableJsonAry);
    })
})

app.post("/update", function (req, res) {

    let picname
    console.log("files are", req.files);
    if (req.files != undefined) {
        picname = req.files.profileImage.name;
        console.log("File Name=" + picname);

        var des = path.join(__dirname, "public", "Assets", "profile", picname);
        req.files.profileImage.mv(des, function (err) {
            if (err)
                console.log(err);
            else
                console.log("Upload Successful");
        })//saving in uploads folder
        update(req, res, picname);

    }
    else {
        console.log(`login email is ${req.body.loginemail}`);
        dbRef.query("SELECT Profile_Pic FROM userdetails WHERE Login_Email=?", [req.body.loginemail], function (err, TableJsonAry) {
            if (err)
                res.status(400).json(err);
            else {
                console.log(`old pic is ${TableJsonAry[0].Profile_Pic}`);
                picname = TableJsonAry[0].Profile_Pic;
                update(req, res, picname);
            }
        })
    }
    console.log(`pic name is ${picname}`);
    console.log(`aashim`)
});

function update(req, res, picname) {
    console.log("update query")
    dbRef.query(
        "UPDATE userdetails SET Profile_Pic=?, Name=?, Company=?, Title=?, Website_Link=?, Number=?, Email=?, Linkdin_Link=?, Facebook_Link=?, Instagram_Link=? WHERE Login_Email=? AND User_Name=?",
        [
            picname,
            req.body.fullname,
            req.body.companyname,
            req.body.title,
            req.body.website,
            req.body.number,
            req.body.email,
            req.body.linkdin,
            req.body.facebook,
            req.body.instagram,
            req.body.loginemail,
            req.body.username,

        ],
        function (err, TableJsonAry) {
            if (err) {
                console.error("Error updating data:", err);
                res.status(500).json("Internal Server Error");
            }

            res.status(200).json("Data Updated");
        }
    );
}


//==================================== Forgot Password Code =============================================================

app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    console.log(`email is ${req.body.email}`)
    try {

        dbRef.query("SELECT * from users WHERE email=?", email, function (err, TableJsonAry) {
            if (err) {
                console.error("Error: ", err);
                res.status(500).json("Internal Server Error");
            } else if (TableJsonAry.length === 1) {
                const token = jwt.sign({ useremail: TableJsonAry[0].email }, 'your-secret-key-sanskar', { expiresIn: '1h' });
                sendResetEmail(TableJsonAry[0].Email, token)
                    .then((result) => {
                        return res.status(200).json({ message: "Password reset link sent to your email address" });
                    })
                    .catch((error) => {
                        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
                    })
            } else {
                res.status(400).json({ message: "Invalid Email Address" });
            }
        })
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
});

async function sendResetEmail(email, token) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'gargaashim123@gmail.com',
                pass: 'zcczzptufnaehotr',
            },
        });

        const mailOptions = {
            from: 'gargaashim123@gmail.com',
            to: email,
            subject: 'Reset your password',
            html: `
                <p>We received a request to reset your password.</p>
                <p>Please click the link below to create a new password:</p>
                <a href=${`http://localhost:3000/resetpassword/${email}/${token}`}>Reset Password</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request a password reset, please ignore this email.</p>
                <p>Sincerely,</p>
                <p>Your App Team</p>
            `,
        };

        await transporter.sendMail(mailOptions);

    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}



//=========================================Reset Password Code======================================
async function retrieveUserData(email) {
    try {
        const [userData] = await dbRef.query('SELECT * FROM users WHERE Email = ?', [email]);
        return userData;
    } catch (error) {
        console.error('Error retrieving user data:', error);
        throw new Error('User not found');
    }
}

async function verifyResetToken(token, userData) {
    try {
        const decodedToken = jwt.verify(token, 'your-secret-key-sanskar');

        // Compare token data with user data:
        const { useremail, resetTokenExpiry } = decodedToken;

        if (useremail !== userData.email) {
            return false; // Email mismatch
        }

        // Check for token expiration:
        if (Date.now() > resetTokenExpiry) {
            return false; // Token expired
        }

        // Optionally, check token against a stored hash:
        if (userData.resetToken !== token) {
            return false; // Token doesn't match stored value
        }

        return true; // Token is valid
    } catch (error) {
        console.error('Error verifying token:', error);
        return false;
    }
}


app.get('/reset-password/:email/:token', async (req, res) => {
    try {
        const { email, token } = req.params;
        const userData = await retrieveUserData(email);
        const isValidToken = await verifyResetToken(token, userData);

        if (isValidToken) {
            res.render('reset-password', { email, token });
        } else {
            res.status(400).json({ message: 'Invalid reset token or user not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post("/reset-password", async (req, res) => {
    try {
        const { password, email, token } = req.body;

        jwt.verify(token, "your-secret-key-sanskar", (err, decoded) => {
            if (err) {
                return res.json({ Status: "Error with token" })
            } else {
                dbRef.query('UPDATE users SET Password = ? WHERE Email = ?', [password, email], (error, result) => {
                    if (error) {
                        // Handle error
                        res.status(400).json({ message: 'Invalid reset token or error updating password' });
                        console.error('Error updating password:', error);
                    } else {
                        // Handle success
                        res.status(200).json({ message: 'Password updated successfully' });
                        console.log('Password updated successfully:', result);
                    }
                });

            }
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ message: 'Invalid reset token or error updating password' });
    }
});

//================================================== For Admin Panel ==================================================================== 

app.get("/allusers", function (req, res) {
    console.log(`data from db is ${req.body}`);
    dbRef.query("SELECT * FROM users", function (err, TableJsonAry) {
        if (err)
            res.status(400).json(err);
        else
            res.status(200).json(TableJsonAry);
    })

})
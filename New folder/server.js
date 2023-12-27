const express = require("express");
const mysql = require("mysql");
const fileuploader = require("express-fileupload");
const path = require("path");
const cors = require("cors");

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
                        dbRef.query("INSERT INTO userdetails (Login_Email) VALUES (?)", [req.body.email], function (err, TableJsonAry) {
                            if (err) {

                                console.error("Error: ", err);
                                res.status(500).json("Internal Server Error");
                            } else {
                                res.status(200).json("Sign Up Successful");
                            }
                        })
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

            return res.status(200).json({ message: TableJsonAry[0].type });
        }
        else {
            res.status(400).json({ message: "Invalid Email or Password" });
        }
    })
})

//=================================================== Submit Data Code =========================================================================

app.post("/profile", function (req, res) {

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

    const data = [
        req.body.username,
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
    ];

    dbRef.query("SELECT User_Name from userdetails WHERE User_Name =?", [req.body.username], function (err, TableJsonAry) {
        if (err) {
            console.error("Error checking existing username:", err);
            return res.status(500).json("=========Internal Server Error========");
        } else if (TableJsonAry.length > 0) {
            return res.status(400).json({ message: "Username Already Exists. Kindly Change It" });
        } else {
            // No existing username, proceed with insertion
            dbRef.query("UPDATE userdetails SET User_Name=?, Profile_Pic=?, Name=?, Company=?, Title=?, Website_Link=?, Number=?, Email=?, Linkdin_Link=?, Facebook_Link=?, Instagram_Link=? WHERE Login_Email=?",
                data, function (err, TableJsonAry) {
                    if (err) {
                        console.error("Error inserting data:", err);
                        return res.status(500).json("Internal Server Error");
                    } else
                        res.status(200).json("Data Stored");
                });
        }
    });
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
    // console.log(`data from db is for update page  ${req.query.loginuser}`);
    dbRef.query("SELECT * FROM userdetails WHERE Login_Email=?", [req.query.loginuser], function (err, TableJsonAry) {
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
        update(req,res, picname);

    }
    else {
        console.log(`login email is ${req.body.loginuser}`);
        dbRef.query("SELECT Profile_Pic FROM userdetails WHERE Login_Email=?", [req.body.loginuser], function (err, TableJsonAry) {
            if (err)
                res.status(400).json(err);
            else { // res.status(200).json(TableJsonAry);
                console.log(`old pic is ${TableJsonAry[0].Profile_Pic}`);
                picname = TableJsonAry[0].Profile_Pic;
                update(req,res, picname);
                // json.Stringify(TableJsonAry);
            }
        })
    }
    console.log(`pic name is ${picname}`);
console.log(`aashim`)
    // dbRef.query(
    //     "UPDATE userdetails SET Profile_Pic=?, Name=?, Company=?, Title=?, Website_Link=?, Number=?, Email=?, Linkdin_Link=?, Facebook_Link=?, Instagram_Link=? WHERE Login_Email=? AND User_Name=?",
    //     [
    //         picname,
    //         req.body.fullname,
    //         req.body.companyname,
    //         req.body.title,
    //         req.body.website,
    //         req.body.number,
    //         req.body.email,
    //         req.body.linkdin,
    //         req.body.facebook,
    //         req.body.instagram,
    //         req.body.loginuser,
    //         req.body.username,

    //     ],
    //     function (err, TableJsonAry) {
    //         if (err) {
    //             console.error("Error updating data:", err);
    //             res.status(500).json("Internal Server Error");
    //         }

    //         res.status(200).json("Data Updated");
    //     }
    // );
});

function update(req,res, picname){
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
            req.body.loginuser,
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
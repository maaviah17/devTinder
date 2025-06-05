const express = require("express");
const connectDB = require("./config/database");
const app = express();
const {User } = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt"); 
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req,res)=>{

    // console.log(req.body);

    try{
        // validation of data
        validateSignUpData(req);
        
        const {firstName, lastName, emailId, password} = req.body;
        // encrypting the password
        const passwordHash = await bcrypt.hash(password,1);
        console.log(passwordHash);

        // Creating a new instance of the user model
        const user = new User({
            firstName,
            lastName, 
            emailId,
            password : passwordHash,
        });


        await user.save();
        res.send("User added successfully ✅");
    }catch(err){
        res.status(500).send("ERROR : " + err.message);
    } 
})

// user login
app.post("/login", async (req,res)=>{

    try{

        const {emailId, password} = req.body;
        const user = await User.findOne({emailId : emailId});
        if(!user){
            res.status(400).send("WRONG LOGIN CREDENTIALS");
        }
        const isPasswordValid = await user.validatePassword(password)
        if(isPasswordValid){
            
            // create a JWT token   
            const token = await user.getJWT();
            console.log(token);

            // add the token to cookie & send back cookie to the user.
            res.cookie("token", token, {
                expires: new Date(Date.now() + 5*36000000)
            });
            res.send("User loggedin successfully");
        }else{
            res.status(400).send("WRONG LOGIN CREDENTIALS");
        }

    }catch(err){
        res.status(400).send("something went wrong !!");
    }
})

app.get("/profile", userAuth , async (req,res)=>{

    try{ 
        const user = req.user;
        console.log("user sending req : ", user.firstName);
        res.send(user);
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }    
})

app.post("/sendConnectionReq", userAuth , async(req,res)=>{

    const user = req.user;
    console.log("connection req recieved");

    res.send(user.firstName + " ne request bheja hai.")
})


connectDB()
    .then(()=>{
        console.log("Db connection established...");
        app.listen(4000,()=>{
            console.log("listening on port 4000...")
        })
    })
    .catch((err)=>{
        console.log(err);
        console.error("Db not connected")
    })


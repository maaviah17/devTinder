const express = require("express");
const connectDB = require("./config/database");
const app = express();
const {User} = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt"); 
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

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
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(isPasswordValid){
            
            // create a JWT token
            const token = jwt.sign({ _id : user._id}, "MMK@USER17");
            console.log(token);

            // add the token to cookie & send back cookie to the user.
            res.cookie("token", token);
            res.send("User loggedin successfully");
        }else{
            res.status(400).send("WRONG LOGIN CREDENTIALS");
        }

    }catch(err){
        res.status(400).send("something went wrong !!");
    }
})

app.get("/profile", async (req,res)=>{

    try{

        const cookie = req.cookies;
        const {token} = cookie;
        
        if(!token){
            throw new Error("invalid token")
        }
        // validate this token
        const decodedMsg = await jwt.verify(token, "MMK@USER17");
        const { _id } = decodedMsg;
        console.log("logged in user is : " + _id);
    
        const user = await User.findById(_id);
        if(!user){
            throw new Error("user does not exist");
        }
        res.send(user);

    }catch(err){
        res.status(400).send("something went wrong");
    }


    
})

// find user by email
app.get("/user", async (req,res)=>{
    const userEmail = req.body.emailId;
    try{
        const user = await User.findOne({
            emailId : userEmail
        });

        if(!user){
            res.status(404).send("User not found")
        }else{
            res.send(user);
        } 
    }catch(err){
        res.status(400).send("Something went wrong ;( ")
    }
})



// FEED API - GET /feed -> get all the users from the db
app.get("/feed", async (req,res)=>{
    try{
        const users = await User.find({});
        res.send(users);
    }catch(err){
        res.status(400).send("Something went wrong ;( ")
    }
})


app.delete("/user", async (req,res)=>{
    
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully")
    }catch(err){
        res.status(400).send("Something went wrong")
    }
})


// update data of the user
app.patch("/user/:userId", async (req,res)=>{

    const userId = req.params?.userId;
    const data = req.body;


    try{
        const ALLOWED_UPDATE = [
             "photoUrl", "about", "gender", "age", "skills",
        ]
    
        const isUpdateAllowed = Object.keys(data).every((k)=>
            ALLOWED_UPDATE.includes(k)
        ); 
        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }
        if(data?.skills.length > 10){
            throw new Error("Cannot add more than 10");
        }
        
        await User.findByIdAndUpdate({ _id : userId }, data, {
            returnDocument : true,
            runValidators : true,
        });
        res.send("User updated successfully !")
    }catch(err){
        res.status(400).send("Update FAILED ;(  => " + err.message);
    }

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


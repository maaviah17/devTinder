const express = require("express");
const connectDB = require("./config/database");
const app = express();
const {User} = require("./models/user");

app.post("/signup", async (req,res)=>{

    // Creating a new instance of the user model
    const user = new User({
        firstName : "Vyrat",
        lastName : "Chokli",
        emailId :"anushka@mail.com",
        password : "iamweak",
    });
    try{
        await user.save();
        res.send("User added successfully ✅");
    }catch(err){
        res.status(500).send("Error saving the user: " + err.message);
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


const express = require("express");
const connectDB = require("./config/database");
const app = express();
const {User} = require("./models/user");

app.use(express.json());


app.post("/signup", async (req,res)=>{

    // console.log(req.body);

    // Creating a new instance of the user model
    const user = new User(req.body);
    
    try{
        await user.save();
        res.send("User added successfully ✅");
    }catch(err){
        res.status(500).send("Error saving the user: " + err.message);
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


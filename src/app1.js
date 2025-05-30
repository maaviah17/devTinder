const express = require("express");
const app = express();

// this is a middleware 
app.use("/",(req,res,next)=>{
    next();
})

// middleware is called middleware because they sit in the middle of the request and response cycle. 
// it passes all the middlewares until it reaches the route handler

app.get("/getUserData", (req,res)=>{
    // Logic of DB call and get user data 

    throw new Error("randomjfnjdjfjdf")
    res.send("User data sent");
})

app.use("/", (err,req,res,next)=>{
    if(err){
        // log your error message
        res.status(500).send("Something went wrong maaaviahhh ;( ");
    }else{
        next();
    }
})


// app.get("/user",(req,res,next)=>{
//     console.log("this is the 1st route");
//     next();
// })


app.listen(4000,()=>{
    console.log("listening on port 4000...")
})
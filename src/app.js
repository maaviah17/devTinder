const express = require("express");
const app = express();

// this is a middleware 
app.use("/",(req,res,next)=>{
    next();
})

// middleware is called middleware because they sit in the middle of the request and response cycle. 
// it passes all the middlewares until it reaches the route handler

app.get("/user", (req,res,next)=>{
    console.log("handling the route2");
    res.send("2nd route handler");
    // next();
})

// app.get("/user",(req,res,next)=>{
//     console.log("this is the 1st route");
//     next();
// })


app.listen(4000,()=>{
    console.log("listening on port 4000...")
})
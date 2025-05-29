const express = require("express");
const app = express();

const { adminAuth,userAuth } = require("./middlewares/auth")

// handle auth middleware for all requests GET,POST,...
app.use("/admin", adminAuth);
app.use("/user", userAuth);

app.get("/admin/getAllData", (req,res)=>{
    // logic of fetching the data;
    res.send("All data sent");
    
})

app.get("/admin/deleteUser", (req,res)=>{
    // logic of deleting the user
    res.send("Deleted the user")
})

app.get("/user/",  userAuth, (req,res)=>{
    res.send("User data sent !")
})

app.listen(9010,()=>{
    console.log("route listening fine...")
})
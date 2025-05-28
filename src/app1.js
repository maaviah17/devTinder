const express = require("express");
const app = express();

app.use("/test", (req,res)=>{
    res.send("this is the /test route");
})

app.use("/hello", (req,res)=>{
    res.send("this is the /hello route")
})

app.listen(4010,()=>{
    console.log("server listening...")
})
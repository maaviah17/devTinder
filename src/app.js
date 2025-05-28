const express = require("express");
const app = express();

// app.post("/route", (req,res)=>{
//     res.send("hello from the post api");
// })

app.use("/hello",(req,res)=>{
    res.send("hello from the server");
})

app.use("/loads",(req,res)=>{
    res.send("hello from the server");
})


app.listen(4000,()=>{
    console.log("listening on port 4000...")
})
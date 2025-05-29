const express = require("express");
const app = express();
 
app.get("/user",(req,res)=>{
    res.send({
        firstName : "Muawiyah", 
        lastName : "Khalid"
    });
})

app.post("/user", (req,res)=>{
    res.send("data saved to database !!")
})

app.delete("/user",(req,res)=>{
    res.send("deleted user successfully ;) ")
})

app.use("/test", (req,res)=>{
    res.send("this is the /test route");
})

app.listen(4010,()=>{
    console.log("server listening...")
})
const express = require("express");
const connectDB = require("./config/database");
const app = express(); 
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const { authRouter } = require("./routes/auth");
const {profileRouter} = require("./routes/profile")
const { requestRouter } = require("./routes/requests");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);


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


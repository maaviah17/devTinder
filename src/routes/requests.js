const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestRouter.post("/sendConnectionReq", userAuth , async(req,res)=>{

    const user = req.user;
    console.log("connection req recieved");

    res.send(user.firstName + " ne request bheja hai.")
})

module.exports = {
    requestRouter
};
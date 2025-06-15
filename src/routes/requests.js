const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const {ConnectionRequest} = require("../models/connectionRequest");

requestRouter.post("/request/send/:status/:toUserId", userAuth , async(req,res)=>{

    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if(!allowedStatus.includes(status)){
            throw new Error("Invalid status type: " + status)
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        })


        const data = await connectionRequest.save();

        res.json({
            message : "Connection request sent successfully.",
            data,
        })
    }catch(err){
        res.status(500).send("ERROR : " + err.message);
    }
})

module.exports = {
    requestRouter
};
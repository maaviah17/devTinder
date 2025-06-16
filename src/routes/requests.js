const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const {ConnectionRequest} = require("../models/connectionRequest");
const {User} = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth , async(req,res)=>{

    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if(!allowedStatus.includes(status)){
            throw new Error("Invalid status type: " + status)
        }

        //checkinf if user is trying to send a request to themselves
        if(fromUserId.toString() == toUserId.toString()){
            return res.status(400).json({
                message : "Dumbo You cannot send a connection request to yourself."
            })
        }

        // checking if the user exists
        const userExist = await User.findById(toUserId);
        if(!userExist){
            return res.status(404).json({
                message: "User not found !!"
            })
        }


        // checking if there is an existing connection request
        const existingRequest = await ConnectionRequest.findOne({
            $or : [
                { fromUserId, toUserId},
                {fromUserId : toUserId, toUserId : fromUserId}
            ],  
        })
        if(existingRequest){
            return res.status(400).json({
                message : "Connection request already exists between these users"
            })
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        })


        const data = await connectionRequest.save();

        res.json({
            message : req.user.firstName + " is " + status + " in " + userExist.firstName + "'s profile" ,
            data,
        })
    }catch(err){
        res.status(500).send("ERROR : " + err.message);
    }
})

module.exports = {
    requestRouter
};
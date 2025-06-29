const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");
const { faG } = require("@fortawesome/free-solid-svg-icons");

const sendEmail = require("../utils/sendEmail");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {

    try {

        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            throw new Error("Invalid status type: " + status)
        }

        //checkinf if user is trying to send a request to themselves
        if (fromUserId.toString() == toUserId.toString()) {
            return res.status(400).json({
                message: "Dumbo You cannot send a connection request to yourself."
            })
        }

        // checking if the user exists
        const userExist = await User.findById(toUserId);
        if (!userExist) {
            return res.status(404).json({
                message: "User not found !!"
            })
        }


        // checking if there is an existing connection request
        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ],
        })
        if (existingRequest) {
            return res.status(400).json({
                message: "Connection request already exists between these users"
            })
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        })

        // console.log("fromUserId:", req.user?._id);
        // console.log("toUserId:", toUserId);
        // console.log("status:", status);



        const data = await connectionRequest.save();

        const emailRes = await sendEmail.run();
        console.log(emailRes);

        res.json({
            message: req.user.firstName + " is " + status + " in " + userExist.firstName + "'s profile",
            data,
        })
    } catch (err) {
        res.status(500).send("ERROR : " + err.message);
    }
})




// the middleware auth is requirted to check if the user is loggedin or not
// this api is used to review the connection request.... status can be "accepted", "rejected" or "ignored"
//“Hey Bob, someone sent you a connection request. Do you want to accept or reject it?” <----  the crux of the api
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {

    try {

        const loggedinUser = req.user;
        const status = req.params.status;
        const requestId = req.params.requestId;

        const allowedStatus = ["accepted", "rejected"];

        // validating the status
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid status type: " + status
            })
        }

        // checking / finding the connection request
        // const connectionRequest = await ConnectionRequest.findById(requestId);
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedinUser._id,
            // status: "interested",
        });

        console.log("this is the req id : " + requestId);
        console.log("this is the loggedin : " + loggedinUser);

        if (!connectionRequest) {
            return res.status(404).json({
                message: "Connection request not found !!"
            })
        }

        if (connectionRequest.toUserId.toString() !== loggedinUser._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to review this request"
            })
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        return res.json({
            message: "Connection request " + status,
            data
        });


    } catch (err) {
        return res.status(500).send("ERROR : " + err.message);
    }

})

module.exports = {
    requestRouter
};
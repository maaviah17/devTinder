const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"

//get all the pending connection request for the loggedin user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {

    try {
        const loggedinUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedinUser._id,
            status: "interested",
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "about", "skills"]);

        return res.json({
            message: "Data fetched successfully",
            data: connectionRequests,
        })

    } catch (err) {
        return res.status(400).json({
            message: "ERROR : " + err.message
        })
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {

    try {

        const loggedinUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedinUser._id, status: "accepted" },
                { fromUserId: loggedinUser._id, status: "accepted" },
            ],
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map((k) => {
            if (k.fromUserId._id.toString() === loggedinUser._id.toString()) {
                return k.toUserId;
            }

            return k.fromUserId;
        });

        res.json({
            message: "Connections fetched successfully",
            data,
        })

    } catch (err) {
        res.status(400).send({
            message: err.message
        })
    }
})

module.exports = userRouter;
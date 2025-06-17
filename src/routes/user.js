const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");
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


userRouter.get("/feed", userAuth, async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;

        const skip = (page - 1) * limit;

        //user should see all the other cards except ->
        //  i) own card
        //  ii) his connections
        //  iii) ignored people
        //  iv) already sent connection request
        const loggedinUser = req.user;

        // finding alllll the connection reqs that we've sent or recieved
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedinUser._id },
                { toUserId: loggedinUser._id },
            ]
        }).select("fromUserId toUserId")
        // .populate("fromUserId", "firstName").populate("toUserId", "firstName");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })

        // console.log(hideUsersFromFeed);

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedinUser._id } },
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);
        res.json({
            users
        })

    } catch (err) {
        res.status(400).json({
            message: "ERROR : " + err.message
        })
    }
})

module.exports = userRouter;
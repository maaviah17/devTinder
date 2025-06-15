const mongoose = require("mongoose");


// its to stores the connection requests sent by the user to other users, status of the request, etc
const connectionRequestSchema = new mongoose.Schema({

    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
    },
    status : {
        type : String,
        required : true,
        enum : {
            values : ["ignored", "interested", "accepted", "rejected"], 
            message : `{VALUE} is incorrect status type`
        }

    }

},{
    timestamps : true,
});

const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = {
    ConnectionRequest
};
// This model is used to manage connection requests between users in a social network or similar application.
// It includes fields for the sender and receiver of the request, as well as the status of the request.
// The model is exported for use in other parts of the application, such as controllers or services that handle user connections.
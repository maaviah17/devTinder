const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const { ConnectionRequest } = require("../models/connectionRequest");
const sendEmail = require("./sendEmail");

// job scheduled to run @8am every morning
cron.schedule("0 8 * * *", async () => {

    // send emails to all the users who received a connection request a day before
    try {

        // its like substracting -> so new date gets the current date, 1 to get the => current day - 1 = yesterday
        const yesterday = subDays(new Date(), 0);

        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        const pendingRequests = await ConnectionRequest.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd,
            }
        }).populate("fromUserId toUserId");

        // creating a set so that we dont get repeated id's 
        const listOfEmails = [...new Set(pendingRequests.map((req) => req.toUserId.emailId))]

        console.log(listOfEmails);

        // looping through each email present in the list and sending them the mail
        for (const email of listOfEmails) {
            try {
                const res = await sendEmail.run("New Friend Request Pending !! " + email, "There are so many friend request pending"
                    + "login to the devtinder.website to get started🔥 ");
                console.log(res);
            } catch (err) {
                console.log("ERROR : ", err);
            }
        }

    } catch (err) {
        console.log("ERROR : + ", err);
    }

});
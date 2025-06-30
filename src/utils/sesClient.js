const { SESClient } = require("@aws-sdk/client-ses");
require("dotenv").config();

console.log('Current directory:', process.cwd());
console.log('All environment variables:', Object.keys(process.env));

console.log("AWS_ACCESS_KEY =", process.env.AWS_ACCESS_KEY_ID);
console.log("AWS_SECRET_KEY =", process.env.AWS_SECRET_ACCESS_KEY);
console.log("AWS_REGION =", process.env.AWS_REGION);
console.log("SENDER_EMAIL =", process.env.SENDER_EMAIL);

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
    throw new Error("Missing required AWS environment variables");
}



// Set the AWS Region.
const REGION = process.env.AWS_REGION || "eu-north-1";

// Create SES service object.
const sesClient = new SESClient({
    region: REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

module.exports = { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]
const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress) => {
    return new SendEmailCommand({
        Destination: {

            CcAddresses: [
            ],
            ToAddresses: [
                toAddress,
                /* more To-email addresses */
            ],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: "<h1>This is the email body</h1>",
                },
                Text: {
                    Charset: "UTF-8",
                    Data: "This is the text format email",
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Hello world from ses",
            },
        },
        Source: fromAddress,
        ReplyToAddresses: [
        ],
    });
};

const run = async () => {
    const sendEmailCommand = createSendEmailCommand(
        "muawiyah1705@gmail.com",
        "muawiyah@devtinder.website",
    );

    try {
        return await sesClient.send(sendEmailCommand);
    } catch (caught) {
        if (caught instanceof Error && caught.name === "MessageRejected") {
            const messageRejectedError = caught;
            return messageRejectedError;
        }
        throw caught;
    }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };
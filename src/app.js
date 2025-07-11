const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

require("./utils/cronjobs");

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    }));
app.use(express.json());
app.use(cookieParser());

const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile")
const { requestRouter } = require("./routes/requests");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
    .then(() => {
        console.log("Db connection established...");
        app.listen(process.env.PORT, () => {
            console.log("listening on port 4000...")
        })
    })
    .catch((err) => {
        console.log(err);
        console.error("Db not connected")
    })


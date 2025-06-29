const express = require("express");
const { User } = require("../models/user");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
    // console.log(req.body);
    try {
        // validation of data
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;
        // encrypting the password
        const passwordHash = await bcrypt.hash(password, 1);
        console.log(passwordHash);

        // Creating a new instance of the user model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        const savedUser = await user.save();
        const token = await savedUser.getJWT();

        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 360000),
        })

        res.json({
            message: "User added successfully",
            data: savedUser
        })
    } catch (err) {
        res.status(500).send("ERROR : " + err.message);
    }
})

// user login
authRouter.post("/login", async (req, res) => {

    try {

        console.log("🔐 /login hit");
        const { emailId, password } = req.body;
        console.log("📥 Body:", req.body);
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            res.status(400).send("WRONG LOGIN CREDENTIALS");
        }
        const isPasswordValid = await user.validatePassword(password)
        if (isPasswordValid) {

            // create a JWT token   
            const token = await user.getJWT();
            console.log(token);

            // add the token to cookie & send back cookie to the user.
            res.cookie("token", token, {
                expires: new Date(Date.now() + 5 * 36000000)
            });
            // res.send(user)
            return res.status(200).send(user);
        } else {
            return res.status(400).send("WRONG LOGIN CREDENTIALS");
        }

    } catch (err) {
        // res.status(400).send("something went wrong !!");
        console.error("💥 Login error:", err);
        return res.status(500).send("something went wrong !!");
    }
})

authRouter.post("/come", (req, res) => {

    console.log("api hit");
    return res.status(200).send({
        message: "hey this is successfull"
    })

})

// logout user
authRouter.post("/logout", (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
        })
        res.send("user logged out :) ")
    } catch (err) {
        res.status(400).send("something went wrong !!");
    }
})

module.exports = {
    authRouter
};
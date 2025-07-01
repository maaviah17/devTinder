const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

// const userAuth =  (req,res,next)=>{
//     console.log("User auth middleware is getting checked !!");
//     const token = "abcdef";
//     const isAdminAuthorized = token === "abcdef";
//     if(!isAdminAuthorized){
//         res.status(401).send("Unauthorized request !!!");
//     }else{
//         next();
//     }
// };


const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        console.log("token recieved : ", req.cookies.token);
        if (!token) {
            return res.status(401).send("Please login !!");
            console.log("no token")
        }

        const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);

        const { _id } = decodedObj;

        const user = await User.findById(_id);
        if (!user) {
            return res.status(401).send("No token found");
        }
        req.user = user;
        next();

        // validate the token

        // find the user

    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
    // read the token from the req cookies

}



module.exports = {
    userAuth,
};
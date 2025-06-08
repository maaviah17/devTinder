const { Error } = require("mongoose");
const mongoose = require("mongoose");
const validator  = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minLength : 4,
        maxLength : 28,
    },
    lastName : {
        type : String
    },
    emailId : {
        type : String,
        lowercase : true,
        required : true,
        unique : true,
        trim : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address" + value);
            }
        }
    },
    password : {
        type : String,
        required : true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong passsword" + value);
            }
        }
    },
    age : {
        type : Number,
        min : 18
    },
    gender : {
        type : String,
        enum : {
            values : ["male", "femle", "other"],
            message : `{VALUE} is incorrect !!`
        }
    },
    photoUrl : { 
        type : String,
        default : "https://www.pnrao.com/wp-content/uploads/2023/06/dummy-user-male.jpg", 
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Not a proper URL " + value);
            }
        }
    },
    about : {
        type : String,
        default : "This is a default about of the user!"
    },
    skills : {
        type : [String] 
    }
},{
    timestamps : true,
});

userSchema.methods.getJWT = async function(){
    const user = this;  
    const token = await jwt.sign({ _id : user._id}, "MMK@USER17", {
        expiresIn : '1h'
    });
    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;

    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid;
}

const User = mongoose.model("User", userSchema);


module.exports = {
    User
};
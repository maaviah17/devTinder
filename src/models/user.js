const { Error } = require("mongoose");
const mongoose = require("mongoose");
const validator  = require("validator");
 
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
        validate(value){
            if(!["male", "female"].includes(value)){
                throw new Error("Gender data is not valid");
            }
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

const User = mongoose.model("User", userSchema);

module.exports = {
    User
};
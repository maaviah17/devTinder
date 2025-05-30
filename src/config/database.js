const mongoose = require("mongoose");

const connectDB = async () =>{
    await mongoose.connect("mongodb+srv://muawiyah17:JHu4cCngj0EkZl3T@cluster0.0bet8tf.mongodb.net/devTinder");
}

module.exports = connectDB; 



const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required : true
    },
    password : {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "customer"
    },
    date: {
        type: Date,
        default: Date.now()
    }

});

const user = new mongoose.model("user", userSchema);

module.exports = user;
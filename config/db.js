const mongoose = require("mongoose");
const dotenv = require('dotenv')
dotenv.config()
const db = process.env.MONGO_DB_URI;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

const connectDb = async ()=>{
    try{
       await mongoose.connect(db, clientOptions);
       console.log("Successfully connected to database")
    }catch(err){
        console.log("connnection to databse failed");
        process.exit(1)

    }
};
module.exports = connectDb;
const mongoose = require("mongoose");
require("dotenv").config();
const con = "mongodb://localhost:27017/";
const connectDB = async () => {
    try {
        await mongoose.connect(con, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName : "nanbanfund"
        });
        console.log("MongoDB Connected ✅");
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    }
};

module.exports = connectDB;

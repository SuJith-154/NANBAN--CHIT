const mongoose = require("mongoose");
require("dotenv").config();
const con = "mongodb+srv://ERSUJITH:SUJITH@chitfund-pjk.wf5fg.mongodb.net/?retryWrites=true&w=majority&appName=chitfund-pjk";
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

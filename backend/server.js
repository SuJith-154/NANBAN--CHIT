const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const app = express();

connectDB();

app.use(cors({
  origin: 'http://localhost:3001', 
  credentials: true 
}));

app.use(express.json());

app.use("/auth", require("./routes/auth"));

app.use("/user", require("./routes/payment"));
app.use("/admin", require("./routes/admin"));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

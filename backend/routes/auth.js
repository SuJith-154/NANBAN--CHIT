const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/userdata");
const Payment = require("../models/payment");
const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ error: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });

        await newUser.save();
        const currentYear = new Date().getFullYear();
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const paymentEntries = months.map(month => ({
            username,
            amount: 0, 
            date: new Date(`${month} 1, ${currentYear}`),
            month,
            status: "not paid"
        }));

        await Payment.insertMany(paymentEntries);

        res.json({ success: true, message: "✅ Signup successful" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        res.json({ success: true, message: "✅ Login successful", username });
    } catch (err) {
        return res.status(400).json({ success: false, error: "User not found" });

    }
});

module.exports = router;

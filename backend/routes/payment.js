const express = require("express");
const { param, validationResult } = require("express-validator");
const Payment = require("../models/payment");

const router = express.Router();
router.post("/:username/pay", 
  [
    param("username").notEmpty().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          error: errors.array()[0].msg 
        });
      }

      const { username } = req.params;
      const { amount, month, T_ID } = req.body;

      if (!amount || !month || !T_ID) {
        return res.status(400).json({
          success: false,
          error: "Amount, month and transaction ID are required"
        });
      }

      const existingPayment = await Payment.findOne({ T_ID });
      if (existingPayment) {
        return res.status(400).json({
          success: false,
          error: "This transaction ID already exists"
        });
      }

      const newPayment = new Payment({ 
        username, 
        amount, 
        month, 
        T_ID,
        status: "paid", 
        date: new Date()
      });

      await newPayment.save();

      res.json({
        success: true,
        message: "✅ Payment recorded successfully",
        payment: newPayment
      });

    } catch (err) {
      console.error("Payment error:", err);
      
      if (err.code === 11000) {
        return res.status(400).json({
          success: false,
          error: "Duplicate transaction detected"
        });
      }

      res.status(500).json({ 
        success: false,
        error: "Payment processing failed" 
      });
    }
  }
);

router.get("/:username/paid",
  [
    param('username')
      .trim()
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { username } = req.params;
      const userPayments = await Payment.find({ username }).sort({ date: -1 });

      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      const paymentStatusByMonth = {};

      months.forEach(month => {
        paymentStatusByMonth[month] = {
          status: "not paid",
          amount: 0,
          paymentDate: null
        };
      });

      userPayments.forEach(payment => {
        const paymentMonth = payment.month;
        if (months.includes(paymentMonth)) {
          paymentStatusByMonth[paymentMonth] = {
            status: payment.status || "paid",
            amount: payment.amount,
            paymentDate: payment.date
          };
        }
      });

      res.json({
        success: true,
        username,
        payments: paymentStatusByMonth
      });

    } catch (error) {
      console.error("❌ Error in GET /user/:username/paid:", error);
      res.status(500).json({
        success: false,
        error: "Server error while fetching payment data",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      });
    }
  }
);

module.exports = router;

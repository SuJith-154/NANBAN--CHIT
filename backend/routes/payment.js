const express = require("express");
const { param, validationResult } = require("express-validator");
const Payment = require("../models/payment");

const router = express.Router();

router.post("/:username/pay", [
  param("username").notEmpty().trim()
], async (req, res) => {
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

    console.log("DEBUG INPUT:", { username, month, amount, T_ID });

    if (!amount || !month || !T_ID) {
      return res.status(400).json({
        success: false,
        error: "Amount, month and transaction ID are required"
      });
    }

    const existingTransaction = await Payment.findOne({ T_ID });
    if (existingTransaction) {
      return res.status(400).json({
        success: false,
        error: "This transaction ID already exists"
      });
    }
    console.log("FINDING =>", { username, month, status: "not paid" });

    const unpaidPayment = await Payment.findOne({ username, month, status: "not paid" });

    console.log("RESULT =>", unpaidPayment);

    if (!unpaidPayment) {
      return res.status(404).json({
        success: false,
        error: "No pending payment found for this user and month"
      });
    }

    unpaidPayment.amount = amount;
    unpaidPayment.T_ID = T_ID;
    unpaidPayment.status = "paid";
    unpaidPayment.date = new Date();

    await unpaidPayment.save();

    res.json({
      success: true,
      message: "Payment recorded successfully",
      payment: unpaidPayment
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
});


router.get("/:username/paid", [
  param('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { username } = req.params;
    const userPayments = await Payment.find({ username });


    const months = [
      "january", "february", "march", "april", "may", "june",
      "july", "august", "september", "october", "november", "december"
    ];


    const paymentStatusByMonth = {};
    months.forEach((month, index) => {
      const defaultDate = new Date(2025, index, 0); // Ex: 0 => Jan 31, 2025
      paymentStatusByMonth[month] = {
        status: "not paid",
        amount: 0,
        paymentDate: defaultDate
      };
    });

    userPayments.forEach(payment => {
      const paymentMonth = payment.month;
      if (paymentStatusByMonth[paymentMonth]) {
        paymentStatusByMonth[paymentMonth] = {
          status: payment.status || "paid",
          amount: payment.amount,
          paymentDate: payment.date
        };
      }
    });
    console.log("DEBUG PAYMENT STATUS:", paymentStatusByMonth);
    res.json({
      success: true,
      username,
      payments: paymentStatusByMonth
    });

  } catch (error) {
    console.error("Error in GET /user/:username/paid:", error);
    res.status(500).json({
      success: false,
      error: "Server error while fetching payment data",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

module.exports = router;

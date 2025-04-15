const express = require('express');
const router = express.Router();
const Payment = require("../models/payment");
const { param, validationResult } = require('express-validator');

router.get('/:username/paid', 
  [
    param('username')
      .trim()
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
  ],
  async (req, res) => {
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    try {
      const { username } = req.params;
      
      const userPayments = await Payment.find({ username }).sort({ date: -1 });
      

      const months = [
        "January", "February", "March", "April", 
        "May", "June", "July", "August", 
        "September", "October", "November", "December"
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
            status: payment.status,
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
      console.error('Error in GET /api/user/:username/paid:', error);
      res.status(500).json({
        success: false,
        error: 'Server error while fetching payment data',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

module.exports = router;
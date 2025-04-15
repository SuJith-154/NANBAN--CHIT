const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    username: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    month: { type: String, required: true },
    status: { type: String, default: "not paid" } 
});

const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);

module.exports = Payment;

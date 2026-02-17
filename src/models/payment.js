const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  merchantRequestID: {
    type: String,
    required: true,
    unique: true, // Each STK request should be unique
  },
  checkoutRequestID: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  receiptNumber: {
    type: String,
    required: true,
    unique: true, // Receipt numbers are unique per transaction
  },
  balance: {
    type: Number,
    default: 0,
  },
  transactionDate: {
    type: Date,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  resultDesc: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Convert Mpesa transaction date (e.g., 20260217140947) to JS Date
paymentSchema.pre('save', function (next) {
  if (this.transactionDate && typeof this.transactionDate === 'number') {
    const str = this.transactionDate.toString();
    // Format: YYYYMMDDHHMMSS
    this.transactionDate = new Date(
      str.slice(0, 4),          // year
      parseInt(str.slice(4, 6)) - 1, // month 0-based
      str.slice(6, 8),          // day
      str.slice(8, 10),         // hours
      str.slice(10, 12),        // minutes
      str.slice(12, 14)         // seconds
    );
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);

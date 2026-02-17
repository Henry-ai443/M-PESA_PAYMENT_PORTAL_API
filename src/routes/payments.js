const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment'); // Our model

// STK Push Callback Endpoint
router.post('/stkpush/callback', async (req, res) => {
  try {
    const callbackData = req.body.Body.stkCallback;

    // Check if the transaction was successful
    if (callbackData.ResultCode === 0) {
      const metadata = callbackData.CallbackMetadata.Item;

      // Extract values from the callback
      const amount = metadata.find(item => item.Name === 'Amount')?.Value;
      const receiptNumber = metadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
      const balance = metadata.find(item => item.Name === 'Balance')?.Value || 0;
      const transactionDate = metadata.find(item => item.Name === 'TransactionDate')?.Value;
      const phoneNumber = metadata.find(item => item.Name === 'PhoneNumber')?.Value;

      // Create a new payment record
      const payment = new Payment({
        merchantRequestID: callbackData.MerchantRequestID,
        checkoutRequestID: callbackData.CheckoutRequestID,
        amount,
        receiptNumber,
        balance,
        transactionDate,
        phoneNumber,
        resultDesc: callbackData.ResultDesc,
      });

      await payment.save();
      console.log('Payment saved successfully:', payment);
    } else {
      console.log('STK Push failed:', callbackData.ResultDesc);
    }

    // Always respond to Mpesa to acknowledge receipt
    res.json({ ResultCode: 0, ResultDesc: 'Received successfully' });
  } catch (error) {
    console.error('Error processing STK callback:', error);
    res.status(500).json({ ResultCode: 1, ResultDesc: 'Internal Server Error' });
  }
});

module.exports = router;

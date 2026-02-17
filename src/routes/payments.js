const express = require('express');
const router = express.Router();
const { stkPush } = require('../config/mpesa');

// POST /api/pay
router.post('/pay', async (req, res) => {
  try {
    const { phone, amount } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({
        error: 'Phone number and amount are required'
      });
    }

    const response = await stkPush(phone, amount);
    return res.status(200).json(response);

  } catch (error) {
    console.error('STK Push error:', error.message);
    return res.status(500).json({
      error: 'STK Push failed'
    });
  }
});

// MPESA CALLBACK
router.post('/mpesa/callback', (req, res) => {
  console.log('MPESA CALLBACK RECEIVED');
  console.log(JSON.stringify(req.body, null, 2));

  // Always acknowledge Safaricom
  res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { stkPush } = require('../config/mpesa');
router.post('/mpesa/callback', (req, res) => {
  console.log('STK Push Callback received:');
  console.log(JSON.stringify(req.body, null, 2));

  res.status(200).send('OK');
});

router.post('/pay', async (req, res) => {
  const { phoneNumber, amount } = req.body;

  if (!phoneNumber || !amount) {
    return res.status(400).json({ error: 'Phone number and amount are required' });
  } );

  try {
    const response = await stkPush(phoneNumber, amount);
    res.json({ message: 'STK Push initiated', response });
  } catch (error) {
    console.error('Error initiating STK Push:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
module.exports = router;

const express = require('express');
const router = express.Router();
router.post('/mpesa/callback', (req, res) => {
  console.log('STK Push Callback received:');
  console.log(JSON.stringify(req.body, null, 2));

  res.status(200).send('OK');
});

module.exports = router;

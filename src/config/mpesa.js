const axios = require('axios');
const { generateStkPassword } = require('../utils/generateStkPassword');

const consumerKey = process.env.MPESA_CONSUMER_KEY;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

const shortcode = process.env.MPESA_SHORTCODE; // e.g., 174379
const passkey = process.env.MPESA_PASSKEY;    // Daraja portal
const callbackUrl = process.env.MPESA_CALLBACK_URL; // public callback endpoint

// ----------------------
// Access Token Logic
// ----------------------
let cachedToken = null;
let tokenExpiry = null;

async function getAccessToken() {
  if (cachedToken && tokenExpiry && new Date() < tokenExpiry) {
    return cachedToken;
  }

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  try {
    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: { Authorization: `Basic ${auth}` },
      }
    );

    cachedToken = response.data.access_token;
    tokenExpiry = new Date(new Date().getTime() + response.data.expires_in * 1000);

    console.log('New access token fetched, expires at:', tokenExpiry);

    return cachedToken;
  } catch (error) {
    console.error('Failed to get access token:', error.response?.data || error.message);
    throw error;
  }
}

// ----------------------
// STK Push Function
// ----------------------
async function stkPush(phoneNumber, amount) {
  const token = await getAccessToken(); // uses cached token if valid

  const { password, timestamp } = generateStkPassword(shortcode, passkey);

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phoneNumber,
    PartyB: shortcode,
    PhoneNumber: phoneNumber,
    CallBackURL: callbackUrl,
    AccountReference: 'TestPayment',
    TransactionDesc: 'Testing STK Push'
  };

  try {
    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log('STK Push request response:', response.data);
    return response.data;
  } catch (error) {
    console.error('STK Push failed:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = { getAccessToken, stkPush };

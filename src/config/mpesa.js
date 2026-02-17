const axios = require('axios');
require('dotenv').config();

const consumerKey = process.env.MPESA_CONSUMER_KEY;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

let cachedToken = null;
let tokenExpiry = null;

async function getAccessToken(){
    if(cachedToken && tokenExpiry && new Date() < tokenExpiry){
        return cachedToken;
    }
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    try{
        const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers:{
                Authorization: `Basic ${auth}`
            }
        });
        const token = response.data.access_token;
        const expiresIn = response.data.expires_in;
        cachedToken = token;
        tokenExpiry = new Date(new Date().getTime() + expiresIn * 1000);
        console.log("New access token fetched and expires at :", tokenExpiry);
        return token;
    }catch(error){
        console.error('Error fetching access token:', error.message);
        throw error;
    }
}



module.exports = {
    getAccessToken
};
const express = require('express');
const cors = require('cors');
const app = express();
const paymentRoutes = require('./routes/payments');

app.use(cors());
app.use(express.json());

app.use('/api', paymentRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Mpesa Portal API');
});

module.exports = app;
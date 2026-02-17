require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const { getAccessToken } = require('./config/mpesa');

const PORT = process.env.PORT || 5000;

async function startServer(){
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
(async () => {
    const token =await getAccessToken();
    console.log('MPESA Access Token:', token);
})()
startServer();
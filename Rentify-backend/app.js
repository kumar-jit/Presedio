const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const buyerRoutes = require('./routes/buyerRoutes');

const app = express();

// Connect to database
connectDB;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // to read json data

// // Routes
app.use('/api/auth', authRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/buyer', buyerRoutes);


app.get("/test",(req,res) => {
    console.log("working");
    res.send("wokring")
})

app.post("/test",(req,res) => {
    console.log("working");
    res.send("wokring")
})


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server ruport ${PORT}`);
});

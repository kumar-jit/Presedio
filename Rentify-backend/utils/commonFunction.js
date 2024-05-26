const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.getUserIdFromJWTToken =  async (req) => {
    const token = req.header('Authorization');
    const decoded = jwt.verify(token.substring(7), process.env.JWT_SECRET);
    let sellerEmail =  decoded.user.id;

    try{
        const [result] = await db.query('select * from user where Email = ?',sellerEmail);
        return result[0];
    }
    catch(error){
        console.error(error.message);
        res.status(500).send('Server error');
        return;
    }

    
}
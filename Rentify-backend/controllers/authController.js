const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

exports.register = async (req, res) => {
    const { firstName, lastName, email, mobile, password, isSeller } = req.body;

    try {
        // Check if the user already exists
        const [existingUser] = await db.query('SELECT Email FROM User WHERE Email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).send({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const userId = Buffer.from(uuidv4().replace(/-/g, ''), 'hex');
        const user = {
            UserId: userId,
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Mobile: mobile,
            Password: hashedPassword,
            IsSeller: isSeller ? '1' : '0'
        };

        // Insert the new user into the database
        await db.query('INSERT INTO User SET ?', user);

        // Generate a JWT token
        const payload = {
            user: {
                id: email
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d', algorithm: 'HS512' }, (err, token) => {
            if (err) throw err;
            res.send({ message : "User Created suceessfully",
                        userEmail : user.Email,
                        isSeller : user.IsSeller,
                        name : user.firstName + " " + user.lastName,
                        token,  });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const [rows] = await db.query('SELECT * FROM User WHERE Email = ?', [email]);
        if (rows.length === 0) {
            return res.status(400).send({ message: 'Invalid credentials' });
        }

        const user = rows[0];

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.Password); // Assuming you have added the Password column
        if (!isMatch) {
            return res.status(400).send({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const payload = {
            user: {
                id: user.Email
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d', algorithm: 'HS512' }, (err, token) => {
            if (err) throw err;
            res.send({userEmail : rows[0].Email,
                isSeller : rows[0].IsSeller,
                name : rows[0].FirstName + " " + rows[0].LastName, token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


exports.getSeller = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user exists
        const [rows] = await db.query('SELECT * FROM User WHERE Email = ?', [email]);
        if (rows.length === 0) {
            return res.status(400).send({ message: 'Seller not found' });
        }

        const user = rows[0];

        res.send(rows);s
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

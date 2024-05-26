const express = require('express');
const { register, login, getSeller } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/getSeller', getSeller);

module.exports = router;

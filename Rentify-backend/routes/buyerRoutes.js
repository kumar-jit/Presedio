const express = require('express');
const { createInterest, createLike } = require('../controllers/buyerController');
const { getProperties } = require('../controllers/getPropertyController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/interest', authMiddleware, createInterest);
router.post('/like', authMiddleware, createLike);
router.get('/properites', authMiddleware, getProperties);

module.exports = router;

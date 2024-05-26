const express = require('express');
const { createFacilityType, createFacility, createRoom, createProperty } = require('../controllers/sellerController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/facility-type', authMiddleware, createFacilityType);
router.post('/facility', authMiddleware, createFacility);
router.post('/room', authMiddleware, createRoom);
router.post('/property', authMiddleware, createProperty);

module.exports = router;

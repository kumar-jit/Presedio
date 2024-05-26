const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const {getUserIdFromJWTToken} = require('../utils/commonFunction');
require('dotenv').config();

// Create Property along with Rooms and Facilities
exports.createProperty = async (req, res) => {
    const { place, pincode, area, bedrooms, bathRooms, facility } = req.body.property;
    // const sellerId = await getUserIdFromJWTToken(req);
    const { UserID, IsSeller } = await getUserIdFromJWTToken(req);
    let sellerId = UserID, isSeller = IsSeller;

    // creating transaction 
    let connection = ""
    try{
        connection  = await db.getConnection();
        await connection.beginTransaction();
    }
    catch(error){
        console.error(error.message);
        res.status(500).send('DB connection faild');
        return;
    }

    // Creteing sellerrecord
    try {

        // Create Property
        const propId = Buffer.from(uuidv4().replace(/-/g, ''), 'hex');
        const property = {
            PropId: propId,
            SellerID: Buffer.from(sellerId, 'hex'),
            Place: place,
            Pincode: pincode,
            Area: area,
            BathRooms: bathRooms
        };
        await connection.query('INSERT INTO Property SET ?', property);

        // Create Rooms
        for (const room of bedrooms) {
            const roomId = Buffer.from(uuidv4().replace(/-/g, ''), 'hex');
            const roomData = {
                RoomID: roomId,
                RoomType: room.roomType,
                SellerID: Buffer.from(sellerId, 'hex'),
                PropId: propId,
                Area: room.area,
                Image: room.image,
                AttachedBathroom: room.attachedBathrrom === 'yes'
            };
            await connection.query('INSERT INTO Rooms SET ?', roomData);
        }

        // Create Facility Types and Facilities
        for (const fac of facility) {
            const [result] = await connection.query('INSERT INTO FacilityType (Type, Distance) VALUES (?, ?)', [fac.facType.type, fac.facType.distance]);
            const facTypeId = result.insertId;
            const facId = Buffer.from(uuidv4().replace(/-/g, ''), 'hex');
            const facilityData = {
                FacID: facId,
                FacTypeID: facTypeId,
                SellerID: Buffer.from(sellerId, 'hex'),
                PropId: propId,
                Description: fac.desc
            };
            await connection.query('INSERT INTO Facility SET ?', facilityData);
        }

        // Commit the transaction
        await connection.commit();
        await connection.release();
        res.json({ propId: propId.toString('hex') });
    } catch (err) {
        console.error(err.message);
        await connection.rollback();
        res.status(500).send('Server error');
    }
};

// Create FacilityType
exports.createFacilityType = async (req, res) => {
    const { type, distance } = req.body.facType;

    try {
        // Insert the new facility type into the database
        const [result] = await db.query('INSERT INTO FacilityType (Type, Distance) VALUES (?, ?)', [type, distance]);

        res.send({ facTypeId: result.insertId, type, distance });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Create Facility
exports.createFacility = async (req, res) => {
    const { propId, sellerId, facTypeId, desc } = req.body;

    try {
        const facId = Buffer.from(uuidv4().replace(/-/g, ''), 'hex');
        const facility = {
            FacID: facId,
            FacTypeID: facTypeId,
            SellerID: Buffer.from(sellerId, 'hex'),
            PropID: Buffer.from(propId, 'hex'),
            Description: desc
        };

        // Insert the new facility into the database
        await db.query('INSERT INTO Facility SET ?', facility);

        res.json(facility);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Create Room
exports.createRoom = async (req, res) => {
    const { area, image, attachedBathroom, roomType, propId, sellerId } = req.body;

    try {
        const roomId = Buffer.from(uuidv4().replace(/-/g, ''), 'hex');
        const room = {
            RoomID: roomId,
            RoomType: roomType,
            SellerID: Buffer.from(sellerId, 'hex'),
            PropID: Buffer.from(propId, 'hex'),
            Area: area,
            Image: image,
            AttachedBathroom: attachedBathroom === 'yes'
        };

        // Insert the new room into the database
        await db.query('INSERT INTO Rooms SET ?', room);

        res.json(room);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

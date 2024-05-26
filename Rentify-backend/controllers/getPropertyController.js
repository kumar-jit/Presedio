const db = require('../config/db');
const jwt = require('jsonwebtoken');
const {getUserIdFromJWTToken} = require('../utils/commonFunction');
require('dotenv').config();


// Get method to fetch properties with filters
exports.getProperties = async (req, res) => {
    const { UserID, IsSeller } = await getUserIdFromJWTToken(req);
    let userId = UserID, isSeller = IsSeller;
    const { area, place, roomType, facType, bathrooms, pincode } = req.query;

    try {
        // Base query to get properties
        let query = `
            SELECT p.PropID, p.SellerID, p.Area, p.Place, p.PinCode, p.BathRooms,
                   u.FirstName AS SellerName, u.Mobile AS SellerNumber,
                   rt.RoomType, r.RoomID, r.Image, r.Area AS RoomArea,
                   ft.Type AS FacType, f.Description, ft.Distance
            FROM Property p
            JOIN User u ON p.SellerID = u.UserID
            LEFT JOIN Rooms r ON p.PropID = r.PropID
            LEFT JOIN RoomType rt ON r.RoomType = rt.RoomTypeID
            LEFT JOIN Facility f ON p.PropID = f.PropID
            LEFT JOIN FacilityType ft ON f.FacTypeID = ft.FacTypeID
            WHERE 1=1
        `;

        // Adding filters to the query
        if (area) query += ` AND p.Area = ${db.escape(area)}`;
        if (place) query += ` AND p.Place = ${db.escape(place)}`;
        if (roomType) query += ` AND rt.RoomTypeID = ${db.escape(roomType)}`;
        if (facType) query += ` AND ft.FacTypeID = ${db.escape(facType)}`;
        if (bathrooms) query += ` AND p.BathRooms = ${db.escape(bathrooms)}`;
        if (pincode) query += ` AND p.PinCode = ${db.escape(pincode)}`;
        if (isSeller == "1") query += `AND p.SellerID = ${db.escape(userId)}`;
        const [results] = await db.query(query);

        // Structure the response
        const properties = results.reduce((acc, row) => {
            let property = acc.find(p => p.propId === row.PropID.toString('hex'));
            if (!property) {
                property = {
                    propId: row.PropID.toString('hex'),
                    sellerId: row.SellerID.toString('hex'),
                    area: row.Area,
                    place: row.Place,
                    pincode: row.PinCode,
                    bathrooms: row.BathRooms,
                    rooms: {},
                    facility: [],
                    sellerName: row.SellerName,
                    sellerNumber: null,
                    totalLike: 0,
                    isLiked: "No"
                };
                acc.push(property);
            }

            // Add room data
            if (row.RoomID) {
                if (!property.rooms[row.RoomType]) {
                    property.rooms[row.RoomType] = [];
                }
                property.rooms[row.RoomType].push({
                    roomId: row.RoomID.toString('hex'),
                    image: row.Image,
                    area: row.RoomArea
                });
            }

            // Add facility data
            if (row.FacType) {
                property.facility.push({
                    facType: row.FacType,
                    desc: row.Description,
                    distance: row.Distance
                });
            }

            return acc;
        }, []);

        // Add totalLike and conditional sellerNumber/isLiked
        for (const property of properties) {
            const [likeResults] = await db.query('SELECT COUNT(*) AS totalLike FROM LikeProp WHERE PropID = ?', [Buffer.from(property.propId, 'hex')]);
            property.totalLike = likeResults[0].totalLike;

            if (isSeller == "0") {
                const [isLikedResults] = await db.query('SELECT COUNT(*) AS isLiked FROM LikeProp WHERE PropID = ? AND BuyerID = ?', [Buffer.from(property.propId, 'hex'), Buffer.from(userId, 'hex')]);
                property.isLiked = isLikedResults[0].isLiked > 0 ? 'Yes' : 'No';

                const [interestResults] = await db.query('SELECT COUNT(*) AS interested FROM InterestProp WHERE PropID = ? AND BuyerID = ?', [Buffer.from(property.propId, 'hex'), Buffer.from(userId, 'hex')]);
                if (interestResults[0].interested > 0) {
                    property.sellerNumber = property.sellerNumber;
                } else {
                    property.sellerNumber = "";
                }
            } else {
                property.isLiked = undefined;
                property.sellerNumber = undefined;
            }
        }

        res.json(properties);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

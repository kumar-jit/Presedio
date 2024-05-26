const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const {getUserIdFromJWTToken} = require('../utils/commonFunction');
require('dotenv').config();


// Post method to create interest in a property
exports.createInterest = async (req, res) => {
    const { UserID, IsSeller } = await getUserIdFromJWTToken(req);
    let buyerId = UserID, isSeller = IsSeller;
    
    const { propId } = req.body;
    try {

        // Check if the user has already marked interest in the property
        const intarested = await db.query('SELECT * FROM InterestProp WHERE BuyerID = ? AND PropID = ?', [Buffer.from(buyerId, 'hex'), Buffer.from(propId, 'hex')]);

        if (intarested[0].length > 0) {
            // User has already marked interest in the property, so we will remove the interest
            await db.query('DELETE FROM InterestProp WHERE BuyerID = ? AND PropID = ?', [Buffer.from(buyerId, 'hex'), Buffer.from(propId, 'hex')]);
            return res.json({ msg: 'Interest removed.' });
        }

        // User has not marked interest in the property yet, so we will add the interest
        const interestId = Buffer.from(uuidv4().replace(/-/g, ''), 'hex');
        const interest = {
            IntePropID: interestId,
            BuyerID: Buffer.from(buyerId, 'hex'),
            PropID: Buffer.from(propId, 'hex')
        };

        await db.query('INSERT INTO InterestProp SET ?', interest);

        // Fetch seller's details and buyer's details
        const [sellerDetails] = await db.query(`
            SELECT u.Email AS SellerEmail, u.Mobile AS SellerMobile, u.FirstName AS SellerName
            FROM Property p
            JOIN User u ON p.SellerID = u.UserID
            WHERE p.PropID = ?
        `, [Buffer.from(propId, 'hex')]);

        const [buyerDetails] = await db.query('SELECT Email FROM User WHERE UserID = ?', [Buffer.from(buyerId, 'hex')]);

        if (sellerDetails.length > 0 && buyerDetails.length > 0) {
            const sellerEmail = sellerDetails[0].SellerEmail;
            const sellerMobile = sellerDetails[0].SellerMobile;
            const sellerName = sellerDetails[0].SellerName;
            const buyerEmail = buyerDetails[0].Email;

            // Send email to seller
            await sendMail(
                sellerEmail,
                'New Interest in Your Property',
                `Hello ${sellerName},\n\nA buyer has shown interest in your property. You can view the details in your dashboard.`,
                `<p>Hello ${sellerName},</p><p>A buyer has shown interest in your property. You can view the details in your dashboard.</p>`
            );

            // Send email to buyer with seller's contact details
            await sendMail(
                buyerEmail,
                'Seller Contact Details',
                `Hello,\n\nYou have shown interest in a property. The seller's contact number is: ${sellerMobile}`,
                `<p>Hello,</p><p>You have shown interest in a property. The seller's contact number is: ${sellerMobile}</p>`
            );

            return res.json({ interestId: interestId.toString('hex'), msg: 'Interest added.', sellerMobile });
        } else {
            return res.json({ interestId: interestId.toString('hex'), msg: 'Interest added, but seller or buyer details not found.' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Post method to like a property
exports.createLike = async (req, res) => {
    const { UserID, IsSeller } = await getUserIdFromJWTToken(req);
    let buyerId = UserID, isSeller = IsSeller;

    const { propId } = req.body;

    try {
        // Check if the user has already liked the property
        const liked = await db.query('SELECT * FROM LikeProp WHERE BuyerID = ? AND PropID = ?', [Buffer.from(buyerId, 'hex'), Buffer.from(propId, 'hex')]);

        if (liked[0].length > 0) {
            // User has already liked the property, so we will remove the like
            await db.query('DELETE FROM LikeProp WHERE BuyerID = ? AND PropID = ?', [Buffer.from(buyerId, 'hex'), Buffer.from(propId, 'hex')]);
            return res.json({ msg: 'Like removed.' });
        }

        let [result] = await db.query("SELECT * from property");
        const likeId = Buffer.from(uuidv4().replace(/-/g, ''), 'hex');
        const like = {
            LikeID: likeId,
            BuyerID: Buffer.from(buyerId, 'hex'),
            PropID: Buffer.from(propId, 'hex')
        };

        await db.query('INSERT INTO LikeProp SET ?', like);
        res.json({ likeId: likeId.toString('hex') });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

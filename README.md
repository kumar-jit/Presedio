This project is focused on developing a scalable backend for an e-commerce website using Node.js and MySQL. The backend includes features for user registration, property management for sellers, and property interest and like functionalities for buyers. All APIs have been tested via Postman.

Key Features
User Registration and Authentication: Allows users to register as either buyers or sellers. Authentication is managed using JWT tokens.
Property Management for Sellers: Sellers can post, update, and delete properties. Each property can have multiple rooms and facilities associated with it.
Property Viewing for Buyers: Buyers can view properties, express interest, and like properties. Filters can be applied based on various criteria.
Email Notifications: Both buyers and sellers receive email notifications upon expressing interest in a property.
Table Architecture
User

sql
Copy code
CREATE TABLE User (
    UserID BINARY(16) PRIMARY KEY,
    FirstName VARCHAR(80) NOT NULL,
    LastName VARCHAR(80) NOT NULL,
    Email VARCHAR(200) NOT NULL,
    Mobile CHAR(10) NOT NULL,
    Password CHAR(60) NOT NULL,
    IsSeller CHAR(1) NOT NULL
);
RoomType

sql
Copy code
CREATE TABLE RoomType (
    RoomTypeID INT(3) PRIMARY KEY AUTO_INCREMENT,
    RoomType VARCHAR(50) NOT NULL
);
FacilityType

sql
Copy code
CREATE TABLE FacilityType (
    FacTypeID INT(3) PRIMARY KEY AUTO_INCREMENT,
    Type VARCHAR(50) NOT NULL,
    Distance DECIMAL(10, 2) NOT NULL
);
Property

sql
Copy code
CREATE TABLE Property (
    PropID BINARY(16) PRIMARY KEY,
    SellerID BINARY(16) NOT NULL,
    Place VARCHAR(255) NOT NULL,
    PinCode CHAR(8) NOT NULL,
    Area DECIMAL(10, 2) NOT NULL,
    BathRooms BOOLEAN NOT NULL,
    FOREIGN KEY (SellerID) REFERENCES User(UserID)
);
Rooms

sql
Copy code
CREATE TABLE Rooms (
    RoomID BINARY(16) PRIMARY KEY,
    RoomType INT(3) NOT NULL,
    SellerID BINARY(16) NOT NULL,
    PropID BINARY(16) NOT NULL,
    Area DECIMAL(10, 2) NOT NULL,
    Image VARCHAR(255),
    AttachedBathroom BOOLEAN NOT NULL,
    FOREIGN KEY (RoomType) REFERENCES RoomType(RoomTypeID),
    FOREIGN KEY (SellerID) REFERENCES User(UserID),
    FOREIGN KEY (PropID) REFERENCES Property(PropID)
);
Facility

sql
Copy code
CREATE TABLE Facility (
    FacID BINARY(16) PRIMARY KEY,
    FacTypeID INT(3) NOT NULL,
    SellerID BINARY(16) NOT NULL,
    PropID BINARY(16) NOT NULL,
    Description VARCHAR(200),
    FOREIGN KEY (FacTypeID) REFERENCES FacilityType(FacTypeID),
    FOREIGN KEY (SellerID) REFERENCES User(UserID),
    FOREIGN KEY (PropID) REFERENCES Property(PropID)
);
InterestProp

sql
Copy code
CREATE TABLE InterestProp (
    IntePropID BINARY(16) PRIMARY KEY,
    PropID BINARY(16) NOT NULL,
    BuyerID BINARY(16) NOT NULL,
    FOREIGN KEY (BuyerID) REFERENCES User(UserID),
    FOREIGN KEY (PropID) REFERENCES Property(PropID)
);
LikeProp

sql
Copy code
CREATE TABLE LikeProp (
    LikeID BINARY(16) PRIMARY KEY,
    BuyerID BINARY(16) NOT NULL,
    PropID BINARY(16) NOT NULL,
    FOREIGN KEY (BuyerID) REFERENCES User(UserID),
    FOREIGN KEY (PropID) REFERENCES Property(PropID)
);
Project Setup
Clone the Repository:

bash
Copy code
git clone <repository-url>
cd <repository-directory>
Install Dependencies:

bash
Copy code
npm install
Environment Variables:

Create a .env file in the root directory.
Add the following environment variables:
plaintext
Copy code
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=rentify
JWT_SECRET=your_jwt_secret
EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
Database Setup:

Ensure MySQL is installed and running.
Create the database and tables using the provided SQL scripts.
Import the sample data if available.
Run the Server:

bash
Copy code
npm start
Postman Testing:

Use Postman to test the APIs.
Set up authorization in Postman using the JWT token retrieved from the login API.
Email Server Configuration:

Configure your email server credentials in the .env file.
Ensure the email server settings are correct to enable email notifications.

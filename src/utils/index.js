const jwt = require('jsonwebtoken');
require('dotenv').config();

const Util = {
    generateAccessToken: (data) => {
        return jwt.sign({
            _id: data._id,
            email: data.email,
            name: data.name,
        }, process.env.ACCESS_SECRET_KEY, { expiresIn: "100d" });
    }
}

module.exports = Util;
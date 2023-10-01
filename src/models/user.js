const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
require('dotenv').config();
const BCRYPT_SALT = parseInt(process.env.BCRYPT_SALT);

const Schema = mongoose.Schema;

const schema = new Schema(
    {
        phoneNumber: {
            type: String, required: true, trim: true, unique: true
        },
        password: {
            type: String, required: true, trim: true
        },
        email: {
            type: String, required: true, trim: true
        },
        name: {
            type: String, required: true, trim: true
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

schema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      return next()
    }

    this.password = await bcrypt.hash(this.password, BCRYPT_SALT)
})

schema.pre('findOneAndUpdate', async function (next) {
    if (!this.getUpdate().password) {
      return next()
    }

    this.getUpdate().password = await bcrypt.hash(this.getUpdate().password, BCRYPT_SALT)
})
  
const User = mongoose.model('User', schema);

module.exports = User;
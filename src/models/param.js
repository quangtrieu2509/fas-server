const mongoose = require('mongoose')

const Schema = mongoose.Schema

const schema = new Schema(
    {
        deviceId: {
            type: Schema.Types.ObjectId, required: true, trim: true, ref: 'Device'
        },
        fire: {
            type: Number, required: true
        },
        temp: {
            type: Number, required: true
        },
        gas: {
            type: Number, required: true
        },
        warning: {
            type: Boolean, required: true, default: false
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

const Param = mongoose.model('Param', schema)

module.exports = Param
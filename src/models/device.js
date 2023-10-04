const mongoose = require('mongoose')

const Schema = mongoose.Schema

const schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId, required: true, trim: true, ref: 'User'
        },
        name: {
            type: String, required: true, trim: true
        },
        state: {
            type: Boolean, required: true, default: false
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

const System = mongoose.model('Device', schema)

module.exports = System
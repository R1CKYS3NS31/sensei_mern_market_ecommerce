const { Schema, model } = require("mongoose");

const shopSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    image: {
        data: Buffer,
        contentType: String
    },
    description: {
        type: String,
        trim: true
    },
    updated: Date,
    created: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: Schema.ObjectId, ref: 'User'
    }
})

module.exports = model('Shop', shopSchema)
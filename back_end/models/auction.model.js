const { Schema, model } = require("mongoose");

const auctionSchema = new Schema({
    itemName: {
        type: String,
        trim: true,
        require: 'Item name is required'
    },
    description: {
        type: 'String',
        trim: true
    },
    image: {
        data: Buffer,
        contentType: String
    },
    updatedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    bidStart: {
        type: Date,
        default: Date.now
    },
    bidEnd: {
        type: Date,
        required: 'Auction end time is required'
    },
    seller: {
        type: Schema.ObjectId,
        ref: 'User',
    },
    startingBid: {
        type: Number,
        default: 0
    },
    bids: [
        {
            bidder: {
                type: Schema.ObjectId,
                ref: 'User'
            },
            bid: Number,
            time: Date
        }
    ]
})

module.exports = model('Auction', auctionSchema)
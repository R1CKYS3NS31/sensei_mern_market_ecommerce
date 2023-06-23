const { Schema, model } = require("mongoose");

const productSchema = new Schema({
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
    category: {
        type: String
    },
    quantity: {
        type: Number,
        required: 'Quantity is required'
    },
    price: {
        type: Number,
        required: 'Price is required'
    },
    updatedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    shop: {
        type: Schema.ObjectId, ref: 'Shop'
    }
})

module.exports = model("Product", productSchema)
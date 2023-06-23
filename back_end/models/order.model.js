const { Schema, model } = require("mongoose");

const cartItemSchema = new Schema({
    product: {
        type: Schema.ObjectId, ref: 'Product'
    },
    quantity: Number,
    shop: {
        type: Schema.ObjectId, ref: 'Shop'
    },
    status: {
        type: String,
        default: 'Not Processed',
        enum: ['Not Processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
    }
})

const CartItem = model('CartItem', cartItemSchema)

const orderSchema = new Schema({
    products: [cartItemSchema],
    customer_name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    customer_email: {
        type: String,
        trim: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is required'
    },
    delivery_address: {
        street: {
            type: String,
            required: 'Street is required',
        },
        city: {
            type: String,
            required: 'City is required'
        },
        state: {
            type: String
        },
        zipcode: {
            type: String,
            required: 'Zip code is required'
        },
        country: {
            type: String,
            required: 'Country is required'
        },
        payment_id: {},
        updatedAt: Date,
        createdAt: {
            type: Date,
            default: Date.now
        },
        user: {
            type: Schema.ObjectId, ref: 'User'
        }
    }
})

const Order = model('Order', orderSchema)

module.exports = {CartItem,Order}
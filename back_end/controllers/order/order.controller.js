const { Order, CartItem } = require("../../models/order.model")
const { getErrorMessage } = require('../../utils/helpers/dbErrorHandler')

const createOrder = async (req, res) => {
    try {
        req.body.user = req.profile
        const order = new Order(req.body.order)
        let result = await order.save()
        res.status(200).json(result)
    } catch (error) {
        console.error(error);
        res.status(400).json(
            { error: getErrorMessage(error) }
        )
    }
}

const listOrderByShop = async (req, res) => {
    try {
        let orders = await Order.find({
            "products.shop": req.shop._id
        })
            .populate({ path: 'products.product', select: '_id name price' })
            .sort('-createdAt')
            .exec()

        res.status(200).json(orders)
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: getErrorMessage(error)
        })
    }
}

const updateOrder = async (req, res) => {
    try {
        let order = await Order.updateOne(
            { 'products._id': req.body.cartItemId },
            { '$set': { 'products.$.status': req.body.status } }
        )
        res.status(200).json(order)
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: getErrorMessage(error)
        }
        )
    }
}

const getOrderStatusValues = (req, res) => {
    res.status(200).json(CartItem.schema.path('status').enumValues)
}

const orderById = async (req, res, next, id) => {
    try {
        let order = await Order.findById(id)
            .populate('products.product', 'name price')
            .populate('products.shop', 'name')
            .exec()
        if (!order) return res.status(400).json({
            error: 'Order not found'
        })
        req.order = order
        next()
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: getErrorMessage(error)
        })
    }
}

const listOrdersByUser = async (req, res) => {
    try {
        let orders = await Order.find({
            'user': req.profile._id
        })
            .sort('-created')
            .exec()

        res.status(200).json(orders)
    } catch (error) {
        console.error(error);
        res.status(400).json(error)
    }
}

const readOrder = (re1, res) => {
    return res.json(req.order)
}

module.exports = {
    createOrder,
    listOrderByShop,
    updateOrder,
    getOrderStatusValues,
    orderById,
    listOrdersByUser,
    readOrder
}
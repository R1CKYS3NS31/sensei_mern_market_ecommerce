const { createOrder, listOrderByShop, listOrdersByUser, getOrderStatusValues, updateOrder, readOrder, orderById } = require('../../controllers/order/order.controller')
const { decreaseQuantity, increaseQuantity, productById } = require('../../controllers/product/product.controller')
const { isOwner, shopById } = require('../../controllers/shop/shop.controller')
const { requireSignin } = require('../../controllers/user/auth.controller')
const { stripeCustomer, createCharge, userByID } = require('../../controllers/user/user.controller')

const router = require('express').Router()

router.route('/:userId')
    .post(requireSignin, stripeCustomer, decreaseQuantity, createOrder)

router.route('shop/:shopId')
    .get(requireSignin, isOwner, listOrderByShop)

router.route('/user/:userId')
    .get(requireSignin, listOrdersByUser)

router.route('statusvalues')
    .get(getOrderStatusValues)

router.route('/:shopId/cancel/:productId')
    .put(requireSignin, isOwner, increaseQuantity, updateOrder)

router.route('/:orderId/charge/:userId/:shopId')
    .put(requireSignin, isOwner, createCharge, updateOrder)

router.route('/status/:shopId')
    .put(requireSignin, isOwner, updateOrder)

router.route('/:orderId')
    .get(readOrder)

router.param('userId', userByID)
router.param('shopId', shopById)
router.param('productId', productById)
router.param('orderId', orderById)

module.exports = router
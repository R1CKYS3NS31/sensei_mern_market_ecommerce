const { listShops, readShop, createShop, listByOwner, photo, defaultPhoto, shopById } = require('../../controllers/shop/shop.controller')
const { requireSignin, hasAuthorization } = require('../../controllers/user/auth.controller')
const { isSeller, userByID } = require('../../controllers/user/user.controller')

const router = require('express').Router()

router.route('/')
    .get(listShops)

router.route('/:shopId')
    .get(readShop)
    
router.route('/by/:userId')
    .post(requireSignin, hasAuthorization, isSeller, createShop)
    .get(requireSignin, hasAuthorization, listByOwner)

router.route('/logo/:shopId')
    .get(photo, defaultPhoto)

router.route('/defaultphoto')
    .get(defaultPhoto)

router.param('shopId', shopById)
router.route('userId', userByID)

module.exports = router
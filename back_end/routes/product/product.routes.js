const { createProduct, listProductsByShop, listLatest, listRelated, listCategories, listProducts, readProduct, productPhoto, defaultPhoto, updateProduct, removeProduct, productById } = require('../../controllers/product/product.controller')
const { isOwner, shopById } = require('../../controllers/shop/shop.controller')
const { requireSignin } = require('../../controllers/user/auth.controller')

const router = require('express').Router()

router.route('/by/:shopId')
    .post(requireSignin, isOwner, createProduct)
    .get(listProductsByShop)

router.route('/latest')
    .get(listLatest)

router.route('/related/:productId')
    .get(listRelated)

router.route('/categories')
    .get(listCategories)

router.route('/')
    .get(listProducts)

router.route('/:productId')
    .get(readProduct)

router.route('/image/:productId')
    .get(productPhoto, defaultPhoto)

router.route('/defaultPhoto')
    .get(defaultPhoto)

router.route('/:shopId/:productId')
    .put(requireSignin, isOwner, updateProduct)
    .delete(requireSignin, isOwner, removeProduct)

router.param('shopId', shopById)
router.param('productId', productById)
module.exports = router
const formidable = require("formidable-serverless")
const Product = require("../../models/product.model")
const fs = require('fs')
const { getErrorMessage } = require("../../utils/helpers/dbErrorHandler")
const defaultImage = './images/default.png'

const createProduct = (req, res, next) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                message: 'Image could not be uploaded'
            })
        }
        let product = new Product(fields)
        product.shop = req.shop
        if (files.image) {
            product.image.data = fs.readFileSync(files.image.path)
            product.image.contentType = files.image.type
        }
        try {
            let result = await product.save()
            res.json(result)
        } catch (error) {
            console.error(error);
            res.status(400).json({
                error: getErrorMessage(err)
            })
        }
    })
}

const productById = async (req, res, next, id) => {
    try {
        let product = await Product.findById(id)
            .populate('shop', '_id name')
            .exec()
        if (!product) return res.status(400).json({
            error: 'product not found'
        })
        req.product = product
        next()
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: 'could not retrieve product'
        })
    }
}

const productPhoto = (req, res, next) => {
    if (req.product.image.data) {
        res.set('Content-Type', req.product.image.contentType)
        return res.send(req.product.image.data)
    }
    next()
}

const defaultPhoto = (req, res) => {
    return res.sendFile(process.cwd() + defaultImage)
}

const readProduct = (req, res) => {
    req.product.image = undefined
    return res.json(req.product)
}

const updateProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                message: "Photo could not be uploaded"
            })
        }
        let product = req.product
        product = extend(product, fields)
        product.updated = Date.now()
        if (files.image) {
            product.image.data = fs.readFileSync(files.image.path)
            product.image.contentType = files.image.type
        }
        try {
            let result = await product.save()
            res.json(result)
        } catch (err) {
            console.error(err);
            res.status(400).json({
                error: getErrorMessage(err)
            })
        }
    })
}
const removeProduct = async (req, rs) => {
    try {
        let product = req.product
        let deletedProduct = await product.remove()
        res.status(200).json(deletedProduct)
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: getErrorMessage(error)
        })
    }
}

const listProductsByShop = async (req, res) => {
    try {
        let products = await Product.find({
            shop: req.shop._id
        }).populate('shop', '_id name').select('-image')
        res.status(400).json(products)
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: getErrorMessage(error)
        })

    }
}

const listLatest = async (req, res) => {
    try {
        let products = await Product.find({}).sort('-created').limit(5).populate('shop', '_id name').exec()
        res.json(products)
    } catch (err) {
        return res.status(400).json({
            error: getErrorMessage(err)
        })
    }
}


const listRelated = async (req, res) => {
    try {
        let products = await Product.find({
            "_id": { "$ne": req.product }, "category": req.product.category
        }).limit(5).populate('shop', "_id name").exec()
        res.status(200).json(products)
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: getErrorMessage(error)
        })

    }
}

const listCategories = async (req, res) => {
    try {
        let products = await Product.distinct('category', {})
        res.status(200).json(products)
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: getErrorMessage(error)
        })
    }
}

const listProducts = async (req, res) => {
    const query = {}
    if (req.query.search)
        query.name = { '$regex': req.query.search, '$options': 'i' }
    if (req.query.category && req.query.category != 'All')
        query.category = req.query.category
    try {
        let products = await Product.find(query)
            .populate('shop', '_id name')
            .select('-image')
            .exec
        res.status(200).json(products)
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: getErrorMessage(error)
        })
    }
}

const decreaseQuantity = async (req, res, next) => {
    let bulkOps = req.body.order.products.map((item) => {
        return {
            "updateOne": {
                "filter": {
                    "_id": item.product._id
                },
                "update": {
                    "$inc": { "quantity": -item.quantity }
                }
            }
        }
    })
    try {
        await Product.bulkWrite(bulkOps, {})
        next()
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: 'could not update product'
        })
    }
}

const increaseQuantity = async (req, res, next) => {
    try {
        await Product.findByIdAndUpdate(req.product._id,
            { $inc: { "quantity": req.body.quantity } },
            { new: true }
        ).exec()
        next()
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: getErrorMessage(error)
        })
    }
}

module.exports = {
    createProduct,
    productById,
    productPhoto,
    defaultPhoto,
    readProduct,
    updateProduct,
    removeProduct,
    listProductsByShop,
    listRelated,
    listLatest,
    listCategories,
    listProducts,
    decreaseQuantity,
    increaseQuantity

}
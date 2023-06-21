const formidable = require('formidable')
const Shop = require('../../models/shop.model')
const fs = require('fs')
const errorHandler = require('../../utils/helpers/dbErrorHandler')

const createShop = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        if (err) {
            res.status(400).json({
                message: "Image could not be uploaded"
            })
        }
        let shop = new Shop(fields)
        shop.owner = req.profile
        if (files.image) {
            shop.image.data = fs.readFileSync(files.image.path)
            shop.image.contentType = files.image.type
        }
        try {
            let result = await shop.save()
            res.status(200).json(result)
        } catch (error) {
            console.error(error);
            res.status(400).json({
                error: errorHandler.getErrorMessage(error)
            })
        }
    })
}

const shopById = async (req, res, next, id) => {
    try {
        let shop = await Shop.findById(id)
            .populate('owner', 'id name')
            .exec()

        if (!shop) return res.status('400').json({
            error: "shop not found"
        })

        req.shop = shop
        next()
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: 'could not retrieve shop'
        })
    }
}

const photo = (req, res, next) => {
    if (req.shop.image.data) {
        res.set('Content-Type', req.shop.image.contentType)
        return res.send(req.shop.image.data)
    }
    next()
}

const defaultPhoto = (req, res) => {
    return res.sendFile(process.cwd() + defaultPhoto)
}

const readShop = (req, res) => {
    req.shop.image = undefined
    return res.json(req.shop)
}

const updateShop = (req, res) => {
    let form = formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error(err);
            res.status(400).json({
                message: 'photo could not be uploaded'
            })
        }
        let shop = req.shop
        shop = extend(shop, fields)
        shop.updated = Date.now()
        if (files.image) {
            shop.image.data = fs.readFileSync(files.image.path)
            shop.image, contentType = files.image.type
        }

        try {
            let result = await shop.save()
            res.status(200).json(result)
        } catch (error) {
            console.error(error);
            res.status(400).json(
                { error: errorHandler.getErrorMessage(error) }
            )
        }
    })
}

const removeShop = async (req, res) => {
    try {
        let shop = req.shop
        let deletedShop = shop.remove()
        res.status(200).json(deletedShop)
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: errorHandler(error)
        })
    }
}

const listShops = async (req, res) => {
    try {
        let shops = await Shop.find()
        res.json(shops)
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const listByOwner = async (req, res) => {
    try {
        let shops = await Shop.find({ owner: req.profile._id })
            .populate('owner', '_id name')
        res.status(200).json(shops)

    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: errorHandler.getErrorMessage(error)
        })
    }
}

const isOwner = async (req, res, next) => {
    const isOwner = req.shop && req.auth && req.shop_owner._id == req.auth._id
    if (!isOwner) {
        return res.status(403).json({
            error: 'User is not authorized'
        })
    }
    next()
}

module.exports = {
    createShop,
    shopById,
    photo,
    defaultPhoto,
    listByOwner,
    listShops,
    readShop,
    updateShop,
    isOwner,
    removeShop
}
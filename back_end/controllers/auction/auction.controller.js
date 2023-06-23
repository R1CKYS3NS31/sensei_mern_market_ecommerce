const formidable = require('formidable-serverless')
const fs = require('fs') 
const Auction = require('../../models/auction.model')
const defaultImage = './assets/images/default.png'

const createAuction = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        if (err) {
            res.status(400).json({
                message: "Image could not be uploaded"
            })
        }
        let auction = new Auction(fields)
        auction.seller = req.profile
        if (files.image) {
            auction.image.data = fs.readFileSync(files.image.path)
            auction.image.contentType = files.image.type
        }
        try {
            let result = await auction.save()
            res.status(200).json(result)
        } catch (err) {
            return res.status(400).json({
                error: getErrorMessage(err)
            })
        }
    })
}

const auctionById = async (req, res, next, id) => {
    try {
        let auction = await Auction.findById(id)
            .populate('seller', '_id name')
            .populate('bids.bidder', '_id name')
            .exec()
        if (!auction) return res.status(400).json({
            error: 'Auction not found'
        })
        req.auction = auction
        next()
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: 'Could not retrieve auction'
        })
    }
}

const auctionPhoto = async (req, res, next) => {
    if (req.auction.image.data) {
        res.set('Content-Type', req.auction.image.contentType)
        return res.send(req.auction.image.data)
    }
    next()
}

const defaultPhoto = (req, res) => {
    return res.sendFile(process.cwd() + defaultImage)
}

const readAuctions = (req, res) => {
    req.auction.image = undefined
    return res.status(200).json(req.auction)
}

const updateAuction = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        if (err) {
            res.status(400).json({
                message: 'Photo could not be uploaded'
            })
        }
        let auction = req.auction
        auction = extend(auction, fields)
        auction.updated = Date.now()

        if (files.image) {
            auction.image.data = fs.readFileSync(files.image.path)
            auction.image.contentType = files.image.type
        }
        try {
            let result = await auction.save()
            res.status(200).json(result)
        } catch (error) {
            console.error(error);
            res.status(400).json({
                error: getErrorMessage(error)
            })
        }
    })
}

const removeAuction = async (req, res) => {
    try {
        let auction = req.auction
        let deletedAuction = auction.remove()
        res.status(200).json(deletedAuction)
    } catch (error) {
        console.error(error);
        res.status(200).json({
            error: getErrorMessage(error)
        })
    }
}

const listOpenAuctions = async (req, res) => {
    try {
        let auctions = await Auction.find(
            { 'bidEnd': { $gt: new Date() } }
        ).sort('bidStart')
            .populate('seller', '_id name')
            .populate('bids.bidder', '_id name')
        res.status(200).json(auctions)
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: getErrorMessage(error)
        })
    }
}
const listAuctionsBySeller = async (req, res) => {
    try {
        let auctions = await Auction.find(
            { seller: req.profile._id }
        ).populate('seller', '_id name')
            .populate('bids.bidder', '_id name')

        res.status(200).json(auctions)
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: getErrorMessage(error)

        })
    }
}

const listAuctionsByBidder = async (req, res) => {
    try {
        let auctions = await Auction.find({
            'bids.bidder': req.profile._id
        }).populate('seller', '_id name')
            .populate('bids.biddder', '_id name')

        res.status(200).json(auctions)
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: getErrorMessage(error) })
    }
}

const isSeller = (req, res, next) => {
    const isSeller = rq.auction && req.auth && req.auction.seller._id == req.auth._id
    if (!isSeller) return res.status(403).json({
        error: 'User is not authorized'
    })
    next()
}

module.exports = {
    createAuction,
    auctionById,
    auctionPhoto,
    listOpenAuctions,
    listAuctionsBySeller,
    listAuctionsByBidder,
    readAuctions,
    updateAuction,
    isSeller,
    removeAuction,
    defaultPhoto
}
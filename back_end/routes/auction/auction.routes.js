const { listOpenAuctions, listAuctionsByBidder, readAuctions, createAuction, listAuctionsBySeller, updateAuction, removeAuction, auctionPhoto, defaultPhoto, auctionById } = require('../../controllers/auction/auction.controller')
const { requireSignin, hasAuthorization } = require('../../controllers/user/auth.controller')
const { isSeller, userByID } = require('../../controllers/user/user.controller')

const router = require('express').Router()

router.route('/')
    .get(listOpenAuctions)

router.route('/bid/:userId')
    .get(listAuctionsByBidder)

router.route('/:auctionId')
    .get(readAuctions)

router.route('/by/:userId')
    .post(requireSignin, hasAuthorization, isSeller, createAuction)
    .get(requireSignin, hasAuthorization, listAuctionsBySeller)

router.route('/:auctionId')
    .put(requireSignin, isSeller, updateAuction)
    .delete(requireSignin, isSeller, removeAuction)

router.route('/image/:auctionId')
    .get(auctionPhoto, defaultPhoto)

router.route('/defaultphoto')
    .get(defaultPhoto)

router.param('auctionId', auctionById)
router.param('userId', userByID)

module.exports = router
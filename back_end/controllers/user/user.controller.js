const { getErrorMessage } = require("../../utils/helpers/dbErrorHandler")
const User = require('../../models/user.model')
const extend = require('lodash/extend')

const createUser = async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    return res.status(200).json({
      message: "Successfully signed up!"
    })
  } catch (err) {
    return res.status(400).json({
      error: getErrorMessage(err)
    })
  }
}

const users = async (req, res) => {
  try {
    // let users = await User.find({}, { name: 1, email: 1, createdAt: 1, updatedAt: 1 })
    let usersData = await User.find().select('name email updatedAt createdAt')
    res.json(usersData)
  } catch (err) {
    res.status(500).json({
      error: getErrorMessage(err)
    })
    console.error(getErrorMessage(err))
  }
}

/**
 * Load user and append to req.
 */
const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id)
    console.log(id);
    if (!user)
      return res.status(500).json({
        error: "User not found"
      })
    req.profile = user
    next()
  } catch (err) {
    res.status(500).json({
      error: "Could not retrieve user"
    })
    console.error(err);
  }
}

//  retrieve the user details from req.profile and removes sensitive information
const readUser = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(req.profile)
}


const updateUser = async (req, res) => {
  try {
    let user = req.profile
    user = extend(user, req.body)
    user.updatedAt = Date.now()
    await user.save()
    user.hashed_password = undefined
    user.salt = undefined

    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id }, // Find the user by _id
      { $set: user }, // Update the user object
      { new: true } // Return the updated user
    )
    
    res.json(updatedUser)
  } catch (err) {
    res.status(500).json({
      error: getErrorMessage(err)
    })
    console.error(err);
  }
}

const removeUser = async (req, res) => {
  try {
    let user = req.profile
    let deletedUser = await user.remove()
    deletedUser.hashed_password = undefined
    deletedUser.salt = undefined
    res.json(deletedUser)
  } catch (err) {
    res.status(500).json({
      error: getErrorMessage(err)
    })
    console.error(err);
  }
}

const isSeller = (req, res, next) => {
  const isSeller = req.profile && req.profile.seller

  if (!isSeller) {
    return res.status('403').json({
      error: 'User is not a seller'
    })
  }
  next()
}


const stripe_auth = (req, res, next) => {
  request({
    url: "https://connect.stripe.com/oauth/token",
    method: "POST",
    json: true,
    body: { client_secret: config.stripe_test_secret_key, code: req.body.stripe, grant_type: 'authorization_code' }
  }, (error, response, body) => {
    //update user
    if (body.error) {
      return res.status('400').json({
        error: body.error_description
      })
    }
    req.body.stripe_seller = body
    next()
  })
}

const stripeCustomer = (req, res, next) => {
  if (req.profile.stripe_customer) {
    //update stripe customer
    myStripe.customers.update(req.profile.stripe_customer, {
      source: req.body.token
    }, (err, customer) => {
      if (err) {
        return res.status(400).send({
          error: "Could not update charge details"
        })
      }
      req.body.order.payment_id = customer.id
      next()
    })
  } else {
    myStripe.customers.create({
      email: req.profile.email,
      source: req.body.token
    }).then((customer) => {
      User.update({ '_id': req.profile._id },
        { '$set': { 'stripe_customer': customer.id } },
        (err, order) => {
          if (err) {
            return res.status(400).send({
              error: errorHandler.getErrorMessage(err)
            })
          }
          req.body.order.payment_id = customer.id
          next()
        })
    })
  }
}


const createCharge = (req, res, next) => {
  if (!req.profile.stripe_seller) {
    return res.status('400').json({
      error: "Please connect your Stripe account"
    })
  }
  myStripe.tokens.create({
    customer: req.order.payment_id,
  }, {
    stripeAccount: req.profile.stripe_seller.stripe_user_id,
  }).then((token) => {
    myStripe.charges.create({
      amount: req.body.amount * 100, //amount in cents
      currency: "usd",
      source: token.id,
    }, {
      stripeAccount: req.profile.stripe_seller.stripe_user_id,
    }).then((charge) => {
      next()
    })
  })
}

module.exports = {
  users,
  createUser,
  userByID,
  readUser,
  updateUser,
  removeUser,
  stripe_auth,
  stripeCustomer,
  createCharge,
  isSeller
}
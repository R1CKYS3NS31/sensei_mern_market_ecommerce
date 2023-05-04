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
    let users = await User.find({}, { name: 1, email: 1, createdAt: 1, updatedAt: 1 })
    // let users = await User.find().select('name email updateUserdAt createdAt')
    res.json(users)
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
    if (!user)
      return res.status(500).json({
        error: "User not found"
      })
    req.profile = user
    next()
  } catch (err) {
    return res.status(500).json({
      error: "Could not retrieve user"
    })
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

    await User.findOneAndUpdate(user)
    res.json(user)
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

module.exports = { users, createUser, userByID, readUser, updateUser, removeUser }
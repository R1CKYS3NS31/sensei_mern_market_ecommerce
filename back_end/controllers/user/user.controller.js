const { default: dbErrorHandler } = require("../../utils/helpers/dbErrorHandler")
const User = require('../../models/user.model')


const createUser = async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    return res.status(200).json({
      message: "Successfully signed up!"
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const users = async (req, res) => {
  try {
    let users = await User.find({}, { name: 1, email: 1, createdAt: 1, updateUserdAt: 1 })
    // let users = await User.find().select('name email updateUserdAt createdAt')
    res.json(users)
  } catch (err) {
    res.status(500).json({
      error: dbErrorHandler.getErrorMessage(err)
    })
    console.error(dbErrorHandler.getErrorMessage(err))
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
    user.updateUserd = Date.now()
    await user.save()
    user.hashed_password = undefined
    user.salt = undefined
    res.json(user)
  } catch (err) {
    return res.status(500).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const removeUser = async (req, res) => {
  try {
    let user = req.profile
    let deletedUser = await user.removeUser()
    deletedUser.hashed_password = undefined
    deletedUser.salt = undefined
    res.json(deletedUser)
  } catch (err) {
    return res.status(500).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

module.exports = { users, createUser, userByID, readUser, updateUser, removeUser }
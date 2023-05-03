const express = require('express')
const { users, userByID, createUser, removeUser, readUser, updateUser } = require('../controllers/user/user.controller')
const { default: authController } = require('../controllers/user/auth.controller')

const router = express.Router()

router.route('/api/users')
    .get(users)
    .post(createUser)


router.route('/api/users/:userId')
    .get(authCtrl.requireSignin, readUser)
    .put(authCtrl.requireSignin, authCtrl.hasAuthorization,updateUser)
    .delete(authCtrl.requireSignin, authController.hasAuthorization, removeUser)


router.param('userId', userByID)

module.exports = router
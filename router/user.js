const express = require('express')
const checkAuth = require('../middleware/check-auth')
const {
    users_login_user,
    users_delete_all,
    users_signup_user,
    users_get_all,
    users_patch_user
} = require('../controller/user')
const router = express.Router()

// get userInfo
router.get('/', users_get_all)

// sign up
router.post('/signup', users_signup_user)

// login
router.post('/login', users_login_user)

// update userInfo
router.patch('/:userId', checkAuth, users_patch_user)

// delete userInfo
router.delete('/', users_delete_all)

module.exports = router
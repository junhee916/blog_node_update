const express = require('express')

const {
    commends_delete_commend,
    commends_get_all,
    commends_get_commend,
    commends_post_commend
} = require('../controller/commend')
const checkAuth = require('../middleware/check-auth')
const router = express.Router()

// total get commend
router.get('/', checkAuth, commends_get_all)

// detail get commend
router.get('/:commendId', checkAuth, commends_get_commend)

// register commend
router.post('/', checkAuth, commends_post_commend)

// detail delete commend
router.delete('/:commendId', checkAuth, commends_delete_commend)

module.exports = router
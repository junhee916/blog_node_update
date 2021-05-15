const express = require('express')
const checkAuth = require('../middleware/check-auth')
const {
    boards_delete_board,
    boards_patch_board,
    boards_get_all,
    boards_get_board,
    boards_post_board
} = require('../controller/board')
const router = express.Router()

// total get board
router.get('/', boards_get_all)

// detail get board
router.get('/:boardId', checkAuth, boards_get_board)

// register board
router.post('/', checkAuth, boards_post_board)

// update board
router.patch('/:boardId', checkAuth, boards_patch_board)

// detail delete board
router.delete('/:boardId', checkAuth, boards_delete_board)

module.exports = router
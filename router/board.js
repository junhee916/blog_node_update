const express = require('express')
const boardModel = require('../model/board')
const checkAuth = require('../middleware/check-auth')
const router = express.Router()

// total get board
router.get('/', (req, res) => {

    boardModel
        .find()
        .populate('user', ['email', 'profileImage'])
        .then(boards => {
            res.json({
                msg : "get boards",
                count : boards.length,
                boardInfo : boards.map(board => {
                    return{
                        id : board._id,
                        user : board.user,
                        contents : board.contents,
                        date : board.createdAt
                    }
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

// detail get board
router.get('/:boardId', checkAuth, (req, res) => {

    const id = req.params.boardId

    boardModel
        .findById(id)
        .populate('user', ['email', 'profileImage'])
        .then(board => {
            if(!board){
                return res.status(401).json({
                    msg : "no board id"
                })
            }
            res.json({
                msg : "get board",
                boardInfo : {
                    id : board._id,
                    user : board.user,
                    contents : board.contents,
                    date : board.createdAt
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

// register board
router.post('/', checkAuth, (req, res) => {

    const {user, contents} = req.body

    const newBoard = new boardModel({
        user, contents
    })

    newBoard
        .save()
        .then(board => {
            res.json({
                msg : "get board",
                boardInfo : {
                    id : board._id,
                    user : board.user,
                    contents : board.contents,
                    date : board.createdAt
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

// update board
router.patch('/:boardId', checkAuth, (req, res) => {

    const id = req.params.boardId

    const updateOps = {}

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    }

    boardModel
        .findByIdAndUpdate(id, {$set : updateOps})
        .then(board => {
            if(!board){
                return res.status(401).json({
                    msg : "no board id"
                })
            }
            res.json({
                msg : "update board by " + id
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

// detail delete board
router.delete('/:boardId', checkAuth, (req, res) => {
    const id = req.params.boardId

    boardModel
        .findByIdAndRemove(id)
        .then(board => {
            if(!board){
                return res.status(401).json({
                    msg : 'no board id'
                })
            }
            res.json({
                msg : "delete board by " + id
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

module.exports = router
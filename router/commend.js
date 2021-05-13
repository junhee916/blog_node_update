const express = require('express')
const commendModel = require('../model/commend')
const router = express.Router()

// detail get commend
router.get('/:commendId', (req, res) => {

    const id = req.params.commendId

    commendModel
        .findById(id)
        .populate('board', ['contents'])
        .populate('user', ['email'])
        .then(commend => {
            res.json({
                msg : "get commend",
                commendInfo : {
                    id : commend._id,
                    board : commend.board,
                    user : commend.user,
                    commend : commend.commend,
                    date : commend.createdAt
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

// register commend
router.post('/', (req, res) => {

    const {contents, user, commend} = req.body

    const newCommend = new commendModel({
        contents, user, commend
    })

    newCommend
        .save()
        .then(commend => {
            res.json({
                msg : "register commend",
                commendInfo : {
                    id : commend._id,
                    board : commend.board,
                    user : commend.user,
                    commend : commend.commend,
                    date : commend.createdAt
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

// detail delete commend
router.delete('/:commendId', (req, res) => {
    
})

module.exports = router
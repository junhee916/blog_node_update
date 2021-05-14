const express = require('express')
const commendModel = require('../model/commend')
const router = express.Router()

// total get commend
router.get('/', (req, res) => {

    commendModel
        .find()
        .populate('user', ['email', 'profileImage'])
        .populate('board', ['contents'])
        .then(commends => {
            res.json({
                msg : "get commends",
                count : commends.length,
                commendInfo : commends.map(commend => {
                    return {
                        id : commend._id,
                        user : commend.user,
                        board : commend.board,
                        commend : commend.commend,
                        date : commend.createdAt
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

// detail get commend
router.get('/:commendId', async (req, res) => {

    const id = req.params.commendId

    try{
        const commend = await commendModel.findById(id)
            .populate('board', ['contents'])
            .populate('user', ['email'])

        res.json({commend})

    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }

})

// register commend
router.post('/', (req, res) => {

    const {board, user, commend} = req.body

    const newCommend = new commendModel({
        board, user, commend
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
router.delete('/:commendId', async (req, res) => {

    const id = req.params.commendId

    try{
        await commendModel.findByIdAndRemove(id)
        res.json({
            msg : "delete commend id " + id
        })
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

module.exports = router
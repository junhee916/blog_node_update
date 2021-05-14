const express = require('express')
const userModel = require('../model/user')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')
const router = express.Router()

const storage = multer.diskStorage(
    {
        destination : function(req, file, cb){
            cb(null, './uploads')
        },
        filename : function (req, file, cb){
            cb(null, file.originalname)
        }
    }
)

const fileFilter = (req, file, cb) => {

    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    }
    else{
        cb(null, false)
    }
}

const upload = multer(
    {
        storage : storage,
        limit : {
            filesize : 1024*1024*5
        },
        fileFilter : fileFilter
    }
)

// get userInfo
router.get('/', (req, res) => {

    userModel
        .find()
        .then(users => {
            res.json({
                msg : "get users",
                count : users.length,
                userInfo : users.map(user => {
                    return{
                        id : user._id,
                        name : user.name,
                        email : user.email,
                        password : user.password,
                        rule : user.rule,
                        profileImage : user.profileImage
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

// sign up
router.post('/signup', async (req, res) => {

    const {name, email, password} = req.body

    try{
        const user = await userModel.findOne({email})
        if(user){
            return res.status(400).json({
                msg : 'user email, please other eamil'
            })
        }
        else{
            const user = new userModel({
                name, email, password
            })

            await user.save()

            res.json({user})
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// login
router.post('/login', async (req, res) => {

    const {email, password} = req.body

    try{

        const user = await userModel.findOne({email})

        if(!user){
            return res.status(400).json({
                msg : 'user email, please other email'
            })
        }
        else{
            await user.comparePassword(password, (err, isMatch) => {
                if(err || !isMatch){
                    return res.status(401).json({
                        msg : 'not match password'
                    })
                }
                else{
                    const payload = {
                        id : user._id,
                        email : user.email
                    }

                    const token = jwt.sign(
                        payload,
                        process.env.SECRET_KEY,
                        {expiresIn: '1h'}
                    )

                    res.json({token})
                }
            })
        }

    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// update userInfo
router.patch('/:userId', checkAuth, async (req, res) => {

    const id = req.params.userId

    const updateOps = {}

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    }

    try{
        const user = await userModel.findByIdAndUpdate(id, {$set : updateOps})
        res.json({user})
    }
    catch(err){
        res.status(500).json({
            msg: err.message
        })
    }
})

// delete userInfo
router.delete('/', (req, res) => {

    userModel
        .remove()
        .then(() => {
            res.json({
                msg : "delete users"
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

module.exports = router
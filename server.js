require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const boardRouter = require('./router/board')
const userRouter = require('./router/user')
const commendRouter = require('./router/commend')

const connectDB = require('./config/database')
connectDB()

// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))

app.use(morgan('dev'))
app.use(cors())

app.use('/board', boardRouter)
app.use('/user', userRouter)
app.use('/commend', commendRouter)

const PORT = process.env.PORT || 7000

app.listen(PORT, console.log("connected server..."))
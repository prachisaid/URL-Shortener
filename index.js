const express = require('express')
const {connectToMongoDB} = require('./connection')
const {checkForAuthentication, restrictTo} = require('./middleware/auth')
const path = require('path')
const cookieParser = require('cookie-parser')

const urlRoutes = require('./routes/url')
const staticRoute = require('./routes/staticRouter')
const userRoutes = require('./routes/user')

const app = express()

connectToMongoDB("mongodb://127.0.0.1:27017/urlshortenerproject")
.then(() => console.log("MongoDB connected"))

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

app.use(express.json())
app.use(express.urlencoded({extended : false}))
app.use(cookieParser())
app.use(checkForAuthentication)

app.use('/url', restrictTo(["NORMAL"]), urlRoutes)
app.use('/', staticRoute)
app.use('/user', userRoutes)

app.listen(8000, (err) => console.log("Server Started"))
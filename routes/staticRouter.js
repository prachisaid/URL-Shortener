const express = require('express')
const router = express.Router()
const URL = require('../models/url')
const { restrictTo } = require('../middleware/auth')

router.get("/admin/urls", restrictTo(["NORMAL", "ADMIN"]),  async(req, res) => {
    const allurls = await URL.find({})
    return res.render('home', {url : allurls} )
})

router.get('/', async (req, res) => {
    // console.log("Request : " + req.user)
    if(!req.user) return res.redirect("/login")

    const allurls = await URL.find({createdBy : req.user._id})
    return res.render('home', {url : allurls} )
})

router.get('/login', (req, res) => {
    return res.render('login')
})

router.get('/signup', (req, res) => {
    return res.render('signup')
})

module.exports = router
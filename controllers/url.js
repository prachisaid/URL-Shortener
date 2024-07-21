const shortid = require('shortid')
const URL = require('../models/url')

async function handleGenerateNewShortURL(req, res) {
    const body = req.body
    console.log("Body " + body.url)
    if(!body.url) return res.status(400).json({error : 'Url required'})
    
    const shortID = shortid();
    await URL.create({
        shortId : shortID,
        redirectURL : body.url,
        visitHistory : [],
        createdBy : req.user._id
    })

    return res.render('home', {id : shortID})
}

async function handleRedirectURL(req, res) {
    let shortId = req.params.shortId

    const entry = await URL.findOneAndUpdate(
        {
            shortId
        },
        {
            $push : {
                visitHistory : {
                    timestamp : Date.now()
                }
            }
        }
    )

    console.log(entry)
    return res.redirect(entry.redirectURL)
}

async function handleGetAnalytics(req, res) {
    let shortid = req.params.shortId;

    const entry = await URL.find({
        shortId : shortid
    })

    console.log(entry[0].shortId)
    return res.json({totalClicks : entry[0].visitHistory.length, analytics : entry[0].visitHistory})
}

module.exports = {handleGenerateNewShortURL, handleRedirectURL, handleGetAnalytics}
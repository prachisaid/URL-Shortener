const {getUser} = require('../service/auth')

async function restrictToLoggedinUserOnly(req, res, next) {
    console.log(req.headers)
    const userUid = req.cookies?.uid
    if(!userUid) return res.redirect("/login")
    
    const user = getUser(userUid)
    if(!user) return res.redirect("/login")
    
    req.user = user;
    next()

    // const userUid = req.headers["authorization"]
    // if(!userUid) return res.redirect("/login")
    // const token = userUid.split("Bearer ")[1]
    // const user = getUser(token)
}

async function checkAuth(req, res, next) {
    // console.log(req.headers.authorization)
    // const userUid = req.headers.authorization
    // if(userUid) {
    //     console.log(userUid + " kk")
    //     const token = userUid.split("Bearer ")[1]
    //     const user = getUser(token)
    //     req.user = user;
    // }

    // req.user = null
    // next()

    const userUid = req.cookies?.uid
    console.log(userUid)
    const user = getUser(userUid)
    
    req.user = user;
    next()
}

function checkForAuthentication(req, res, next) {
    const userUid = req.cookies?.uid
    req.user = null

    if(!userUid) {
        return next()
    }

    const user = getUser(userUid)

    req.user = user

    return next()
}

function restrictTo(roles = []) {
    return function(req, res, next) {
        if(!req.user) return res.redirect("/login")
        if(!roles.includes(req.user.role)) return res.end("Unauthorized")
        return next()
    }
}

module.exports = {
    checkForAuthentication,
    restrictTo
}

// const authorizationHeaderValue = req.headers["authorization"]
// req.user = null

// if(!authorizationHeaderValue || !authorizationHeaderValue.startsWith("Bearer")) {
//     return next()
// }

// const token = authorizationHeaderValue.split("Bearer ")[1];
// const user = getUser(token)

// req.user = user

// return next()
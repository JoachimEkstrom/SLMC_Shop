const jwt = require("jsonwebtoken")

function authToken(req, res, next){
 
    const auth = req.headers['authorization']
    const token = auth && auth.split(' ')[1]
    if (token == null) res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.json({ err : "Verifycation error" })
      req.user = user
      next()

    })
}

module.exports = authToken
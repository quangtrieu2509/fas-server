const jwt = require('jsonwebtoken')
require('dotenv').config()

const Authz = {

    verifyToken : (req, res, next) => {
        const token = req.headers.authorization
      
        if(token){
            const accessToken = token.split(' ')[1]
            jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY, (err, user) => {
                if(err)
                    return res.json({Error:'Token không hợp lệ'})
                req.user = user
                // console.log('Verified!')
                return next()
            })
        }
        else return res.json({Error:'Chưa được xác thực'})
    }
}

module.exports = Authz
const jwt = require('jsonwebtoken')

module.exports=(req,res,next)=>{
    try{
        let token = req.headers['authorization'] 
        if (token.startsWith('Bearer ')) {
            try{
                token = token.slice(7, token.length);
                const decoded = jwt.verify(token, process.env.secret_key_token_auth)
                req.verified = decoded
                next()
            }catch(error) {
                res.status(403).json({
                    state: false,
                    message: "token in invalide",
                })
            }
        }
    }catch(e){
        res.status(res.statusCode).json({
            state: false,
            status:res.statusCode,
            message: e.message
        })
    }

}
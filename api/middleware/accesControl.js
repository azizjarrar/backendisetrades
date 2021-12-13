const jwt = require('jsonwebtoken')
const accesData= require("./controls")
module.exports=(req,res,next)=>{
    let token = req.headers['authorization'] 
    if(token==undefined){
        if(checkAcces("public",req.originalUrl,req.get('host'),req.method)==undefined){
            res.status(405).json({
                state: false,
                message: "api not found",
            })
        }else{
            next()
        }
        return
    }
    try{
         
   
        let role=""
            try{
                if (token.startsWith('Bearer ')) {

                    token = token.slice(7, token.length);
                    const decoded = jwt.verify(token, process.env.JWT_KEY)
                    

                    role=decoded.result[0].id_role
                    if(checkAcces(role,req.originalUrl,req.get('host'),req.method)==undefined){
                        res.status(405).json({
                            state: false,
                            message: "acces denied",
                        })
                        return
                    }else{
                        next()
                    }
                }else{

                    const decoded = jwt.verify(token, process.env.JWT_KEY)
                    role=decoded.result[0].id_role
                    if(checkAcces(role,req.originalUrl,req.get('host'),req.method)==undefined){
                        res.status(405).json({
                            state: false,
                            message: "acces denied",
                        })
                        return
                    }else{
                        next()
                    }                    
                }

            }catch(error) {
                res.status(403).json({
                    state: false,
                    message: "token in invalide",
                })
            }
        
    }catch(e){
        res.status(res.statusCode).json({
            state: false,
            status:res.statusCode,
            message: e.message
        })
    }

}


const checkAcces=(role,path,hostUrl,method)=>{

    return accesData[role].find(data=>method==data.METHOD&&data.URL==path)
}
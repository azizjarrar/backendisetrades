var client = require('../../../db_connection')
const jwt = require("jsonwebtoken");

exports.singup=(req,res)=>{
    if(req.body.nom==undefined){
      res.status(res.statusCode).json({
        message: " nom not found",
        status: res.statusCode,
      });
      return
    }
    if(req.body.email==undefined){
      res.status(res.statusCode).json({
        message: "email not found",
        status: res.statusCode,
      });
      return
    }
    if(req.body.password==undefined){
      res.status(res.statusCode).json({
        message: "password not found",
        status: res.statusCode,
      });
      return
    }
    client.query(` INSERT INTO member (nom, email, password) VALUES ('${req.body.nom}','${req.body.email}','${req.body.password}')`, function (err, result) {
        if (err){
            res.status(res.statusCode).json({
                errorCode: err.message,
                status: res.statusCode,
                
              });
        }else{
            res.status(res.statusCode).json({
                message: "done",
                data:result,
                status: res.statusCode,
              });
        }
      });

}
exports.singin=(req,res)=>{
  if(req.body.email==undefined){
    res.status(res.statusCode).json({
      message: "email not found",
      status: res.statusCode,
    });
    return
  }
  if(req.body.password==undefined){
    res.status(res.statusCode).json({
      message: "password not found",
      status: res.statusCode,
    });
    return
  }
  client.query(`SELECT * FROM  member  WHERE email='${req.body.email}' && password='${req.body.password}' `, function  (err, result) {
    if (err){
        res.status(res.statusCode).json({
            errorCode: err.message,
            status: res.statusCode,
            
          });
    }else{
      if(result.length==0){
        res.status(res.statusCode).json({
          message: "user not found",
          state:404,
          status: res.statusCode,
        });
      }else{
         jwt.sign({ user_auth: {nom:result[0].nom,email:result[0].email} },process.env.secret_key_token_auth_event,{ expiresIn: '86400s' },
        async (err, token) => {
           if(err){
             res.status(res.statusCode).json({
               message: err.message,
               status: res.statusCode,
               state: false,
             });
           }else{
            res.status(res.statusCode).json({
              message: "done",
              token:token,
              data:{nom:result[0].nom,email:result[0].email},
              status: res.statusCode,
            });
           }
   
         },
         
       );
      }
    }
  });
}



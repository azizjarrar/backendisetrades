var client = require('../../../db_connection')
const jwt = require("jsonwebtoken");


exports.singin=(req,res)=>{
  if(req.body.email==undefined){
    res.status(res.statusCode).json({
      message: "email not found",
      error:true,
      status: res.statusCode,
    });
    return
  }
  if(req.body.password==undefined){
    res.status(res.statusCode).json({
      message: "password not found",
      error:true,
      status: res.statusCode,
    });
    return
  }
  client.query(`SELECT * FROM  member  WHERE email='${req.body.email}' && motdepasse='${req.body.password}' `, function  (err, result) {
    if (err){
        res.status(res.statusCode).json({
            errorCode: err.message,
            status: res.statusCode,
          });
    }else{
      if(result.length==0){
        res.status(res.statusCode).json({
          message: "username or password  incorect",
          error:true,
          state:404,
          status: res.statusCode,
        });
      }else{
         jwt.sign({ user_auth: {nom:result[0].nom,email:result[0].email,cin:result[0].cin,id_member:result[0].id_member} },process.env.secret_key_token_auth_event,
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
              data:{nom:result[0].nom,email:result[0].email,memberImage:result[0].memberImage},
              status: res.statusCode,
            });
           }
         },   
       );
      }
    }
  });
}
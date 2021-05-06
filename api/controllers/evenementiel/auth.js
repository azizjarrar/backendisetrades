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
  client.query(`SELECT * ,membre.email FROM  membre JOIN role_membre on role_membre.id_role=membre.role JOIN user on user.cin=membre.cin WHERE membre.email='${req.body.email}' && membre.motdepasse='${req.body.password}' `, function  (err, result) {
    if (err){
        res.status(res.statusCode).json({
            errorCode: err,
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
         jwt.sign({ user_auth: {nom:result[0].nom,email:result[0].email,cin:result[0].cin,id_membre:result[0].id_membre} },process.env.secret_key_token_auth_event,
        async (err, token) => {
           if(err){
             res.status(res.statusCode).json({
               message: err.message,
               status: res.statusCode,
               state: false,
             });
           }else{
             console.log(result[0])
            res.status(res.statusCode).json({
              message: "done",
              token:token,
              data:{role:result[0].role,nom:result[0].nom,prenom:result[0].prenom,tel:result[0].n_tel,cin:result[0].cin,id_membre:result[0].id_membre,email:result[0].email,membreImage:result[0].membreImage},
              status: res.statusCode,
            });
           }
         },   
       );
      }
    }
  });
}
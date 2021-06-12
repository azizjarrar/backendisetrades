var client = require('../../../db_connection')


exports.getOneUser=(req,res)=>{
    if(req.body.id_membre==undefined){
        res.status(res.statusCode).json({
          message: "idmembre not found",
          error:true,
          status: res.statusCode,
        });
        return
      }
    client.query(`SELECT *  FROM  membre WHERE id_membre='${req.body.id_membre}'`,(err,result)=>{
      console.log(result)
        if (err){
            res.status(res.statusCode).json({
                errorCode: err.message,
                status: res.statusCode,
              });
        }else{
            if(result.length==0 || result[0]==undefined){
                res.status(res.statusCode).json({
                  errorCode: "user not found",
                  status: res.statusCode,
              }); 
            }else{
                res.status(res.statusCode).json({
                    message: "user data",
                    data:result,
                  });
            }
   
        }
    })
}
exports.getClubUsers=(req,res)=>{
    if(req.body.idclub==undefined){
        res.status(res.statusCode).json({
          message: "idclub not found",
          error:true,
          status: res.statusCode,
        });
        return
      }
    client.query(`SELECT user.nom,user.prenom,membre.id_membre,membre.email,equipe_membre.equipe  FROM  club JOIN liste_membre on club.id_club=liste_membre.id_club  JOIN membre on membre.cin=liste_membre.cin_membre JOIN user on user.cin=membre.cin JOIN equipe_membre on id_equipe=liste_membre.equipe where club.id_club='${req.body.idclub}'` ,(err,result)=>{
        if (err){
            res.status(res.statusCode).json({
                errorCode: err.message,
                status: res.statusCode,
              });
        }else{
            res.status(res.statusCode).json({
            message: "user data",
            data:result,
            });
        }
    })
}
exports.updateUserInfo=(req,res)=>{
  const email =req.body.email
  const motdepasse=req.body.motdepasse
  if(email!=undefined && motdepasse!=undefined){
    client.query(`UPDATE membre SET email='${email}' , motdepasse='${motdepasse}' where id_membre=${req.verified.user_auth.id_membre} ` ,(err,result)=>{
      if (err){
        res.status(res.statusCode).json({
            errorCode: err.message,
            status: res.statusCode,
          });
    }else{
        res.status(res.statusCode).json({
        message: "email and mdp was updated",
        data:result,
        });
    }
    })
  }else if(email!=undefined ){
    client.query(`UPDATE membre SET email='${email}' where id_membre=${req.verified.user_auth.id_membre}` ,(err,result)=>{
      if (err){
        res.status(res.statusCode).json({
            errorCode: err.message,
            status: res.statusCode,
          });
    }else{
        res.status(res.statusCode).json({
        message: "email was updated",
        data:result,
        });
    }
    })
  }else if(motdepasse!=undefined){
    client.query(`UPDATE membre SET motdepasse='${motdepasse}' where id_membre=${req.verified.user_auth.id_membre}` ,(err,result)=>{
      if (err){
        res.status(res.statusCode).json({
            errorCode: err.message,
            status: res.statusCode,
          });
    }else{
        res.status(res.statusCode).json({
        message: "password was updated",
        data:result,
        });
    }
    })
  }else{
    res.status(res.statusCode).json({
      message: "no change was made",
      
      });
  }
  



}
exports.updateUserImage=(req,res)=>{
//
let url=""
for(let i = 0;i<req.file.path.length;i++){
  if(req.file.path[i]=='\\'){
    url+="/"
  }else{
    url+=req.file.path[i]
  }
}
client.query(`UPDATE membre SET membreimage='${url}' where id_membre=${req.verified.user_auth.id_membre}` ,(err,result)=>{
  if (err){
    res.status(res.statusCode).json({
        errorCode: err.message,
        status: res.statusCode,
      });
}else{
    res.status(res.statusCode).json({
    message: "image was updated",
    data:result,
    });
}
})
}
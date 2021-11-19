var client = require('../../../db_connection')
const validator = require('../../middleware/validator')
/**************************************************************************/
/**************this part is responsible for all users APIS ****************/
/**************************************************************************/

exports.getOneUser=(req,res)=>{
      if (validator(req.body, ["id_membre"], res)) {
        return
      }
    client.query(`SELECT membre.id_membre ,membre.cin ,membre.email ,membre.membreimage,user.age ,user.sexe ,user.date_naissance ,membre.tel FROM  membre  JOIN  user  ON user.cin=membre.cin WHERE id_membre=${client.escape(req.body.id_membre)};`,(err,result)=>{
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
exports.getMembres=(req,res)=>{
    if (validator(req.body, ["idclub"], res)) {
      return
    }
  client.query(`SELECT user.nom,user.prenom,membre.id_membre,membre.email,equipes.equipe  FROM  club JOIN liste_membre on club.id_club=liste_membre.id_club  JOIN membre on membre.cin=liste_membre.cin_membre JOIN user on user.cin=membre.cin JOIN equipes on id_equipe=liste_membre.equipe where club.id_club=${client.escape(req.body.idclub)} and membre.role=1 ;` ,(err,result)=>{
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
exports.getResponsables=(req,res)=>{
    if (validator(req.body, ["idclub"], res)) {
      return
    }
  client.query(`SELECT user.nom,user.prenom,membre.id_membre,membre.email,equipes.equipe  FROM  club JOIN liste_membre on club.id_club=liste_membre.id_club  JOIN membre on membre.cin=liste_membre.cin_membre JOIN user on user.cin=membre.cin JOIN equipes on id_equipe=liste_membre.equipe where club.id_club=${client.escape(req.body.idclub)} and membre.role=2;` ,(err,result)=>{
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
exports.getClubUsers=(req,res)=>{
      if (validator(req.body, ["idclub"], res)) {
        return
      }
    client.query(`SELECT membre.membreimage,user.nom,user.prenom,membre.id_membre,membre.email,membre.tel,equipes.equipe  FROM  club JOIN liste_membre on club.id_club=liste_membre.id_club  JOIN membre on membre.cin=liste_membre.cin_membre JOIN user on user.cin=membre.cin JOIN equipes on id_equipe=liste_membre.equipe where club.id_club=${client.escape(req.body.idclub)};` ,(err,result)=>{
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
  if (validator(req.body, ["email","motdepasse","tel"], res)) {
    return
  }
  const {email,motdepasse,tel}=req.body
  let queryString=`${email!=undefined?"email="+"'"+email+"'":''} ${motdepasse!=undefined?"motdepasse="+"'"+motdepasse+"'":''} ${tel!=undefined?"tel="+"'"+tel+"'":''}`
  for(let i =0;i<queryString.length-1;i++){
    if(queryString[i]==" "&&queryString[i+1]!=" "&&queryString[0]!=" "){
      queryString=queryString.replace(" ",",")
    }
   }

  let query=`UPDATE membre SET ${queryString} where id_membre='${req.verified.user_auth.id_membre}';`;
  client.query(query ,(err,result)=>{
    if (err){
      res.status(res.statusCode).json({
          errorCode: err.message,
          status: res.statusCode,
        });
  }else{
      res.status(res.statusCode).json({
      message: "user data  was updated",
      data:result,
      });
  }
  })
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
client.query(`UPDATE membre SET membreimage='${url}' where id_membre='${req.verified.user_auth.id_membre}';` ,(err,result)=>{
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
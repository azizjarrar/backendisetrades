var client = require('../../../db_connection')

exports.addParticipation=(req,res)=>{
    if(req.body.id_event==undefined){
        res.status(res.statusCode).json({
          message: "id_event not found",
          error:true,
          status: res.statusCode,
        });
        return
      }
    client.query(`SELECT * FROM  participation  WHERE  id_event=${client.escape(req.body.id_event)} and id_membre=${client.escape(req.verified.user_auth.id_membre)}`,(err,result)=>{
        if (err) {
            res.status(res.statusCode).json({
              errorCode: err.message,
              status: res.statusCode,
            });
            return
        }else{
            if(result.length!=0){
                res.status(res.statusCode).json({
                    message: "you are alredy  participeted ",
                    status: res.statusCode,
                  });
            }else{
                client.query(`INSERT INTO participation(id_event,id_membre,statut) 
                VALUES('${req.body.id_event}','${req.verified.user_auth.id_membre}','pas confirmé') 
                `,(err,result)=>{
                    if (err) {
                        res.status(res.statusCode).json({
                          errorCode: err.message,
                          status: res.statusCode,
                        });
                        return
                    }else{
                        res.status(res.statusCode).json({
                            message: "you have been participeted",
                            status: res.statusCode,
                          });
                    }
                })

            }
        }
    })
}
exports.getAllParticipation=(req,res)=>{
    if(req.body.id_event==undefined){
        res.status(res.statusCode).json({
          message: "id_event not found",
          error:true,
          status: res.statusCode,
        });
        return
      }
    client.query(`SELECT  membre.nom,membre.prenom,membre.cin,membre.tel,participation.id_event FROM  participation   JOIN membre on membre.id_membre=participation.id_membre WHERE  id_event=${client.escape(req.body.id_event)}`,(err,result)=>{
        if (err) {
            res.status(res.statusCode).json({
              errorCode: err.message,
              status: res.statusCode,
            });
            return
        }else{
            res.status(res.statusCode).json({
                message: "participation event",
                data:result,
                nombreofparticipation:result.length,
                status: res.statusCode
            });
        }
    })
}
exports.updatestatut=(req,res)=>{
  if(req.body.id_participation==undefined){
      res.status(res.statusCode).json({
        message: "id_participation not found",
        error:true,
        status: res.statusCode,
      });
      return
    }
    client.query(`UPDATE participation participation SET statut='confirmé' where id_participation=${client.escape(req.body.id_participation)}`,(err,result)=>{
      if (err) {
          res.status(res.statusCode).json({
            errorCode: err.message,
            status: res.statusCode,
          });
          return
      }else{
        console.log(result)
          res.status(res.statusCode).json({
   
              "message":"statu updated",
              status: res.statusCode
          });
      }
  })
}
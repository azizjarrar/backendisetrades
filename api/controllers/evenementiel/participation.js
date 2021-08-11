var client = require('../../../db_connection')
var nodemailer = require('nodemailer');

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
                    message: "vous avez déjà participé ",
                    status: res.statusCode,
                    error:true
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
                            message: "you have been participated",
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
    client.query(`SELECT  membre.email,participation.statut,participation.id_participation,user.nom,user.prenom,membre.cin,membre.tel,participation.id_event FROM  participation   JOIN membre on membre.id_membre=participation.id_membre JOIN user on membre.cin=user.cin WHERE  id_event=${client.escape(req.body.id_event)}`,(err,result)=>{
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
    if(req.body.email==undefined){
      res.status(res.statusCode).json({
        message: "email not found",
        error:true,
        status: res.statusCode,
      });
      return
    }
    if(req.body.event_name==undefined){
      res.status(res.statusCode).json({
        message: "event_name not found",
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
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'Cclub621@gmail.com',
            pass: 'club123456789'
          }
        });
          var mailOptions = {
            from: 'isetrades@gmail.com',
            to: req.body.email,
            subject: 'result',
            text: "la demande de participation à notre événement a été acceptée " + req.body.event_name
          };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
          res.status(res.statusCode).json({
              "message":"statut updated",
              status: res.statusCode
          });
      }
  })
}
exports.deleteParticipation=(req,res)=>{
  if(req.body.id_participation==undefined){
    res.status(res.statusCode).json({
      message: "id_participation not found",
      error:true,
      status: res.statusCode,
    });
    return
  }
  client.query(`DELETE FROM participation  where id_participation=${client.escape(req.body.id_participation)}`,(err,result)=>{
    if (err) {
        res.status(res.statusCode).json({
          errorCode: err.message,
          status: res.statusCode,
        });
        return
    }else{
      if(result.affectedRows==0){
        res.status(res.statusCode).json({
          "message":"event not found",
          status: res.statusCode
      });
      }else{
        res.status(res.statusCode).json({
          "message":"participation is deleted",
          status: res.statusCode
      });
      }

    }
  })
}

exports.getOneUserParti=(req,res)=>{
client.query(`SELECT  event.titre_event,participation.statut,membre.email,participation.id_participation,user.nom,user.prenom,membre.cin,membre.tel,participation.id_event FROM  participation   JOIN membre on membre.id_membre=participation.id_membre JOIN user on membre.cin=user.cin JOIN event on event.id_event=participation.id_event WHERE  participation.id_membre=${req.verified.user_auth.id_membre}`,(err,result)=>{
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
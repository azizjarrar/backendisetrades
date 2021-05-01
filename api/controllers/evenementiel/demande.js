var client = require('../../../db_connection')
const crypto = require("crypto");
var nodemailer = require('nodemailer');

exports.sendRequest=(req,res)=>{
    var newurlString=""
    if(req.file!=undefined){
      for(let i = 0;i<req.file.path.length;i++){
        if(req.file.path[i]=='\\'){
          newurlString+="/"
        }else{
          newurlString+=req.file.path[i]
        }
      }
    }
      if(req.body.nom==undefined){
        res.status(res.statusCode).json({
          message: " nom not found",
          error:true,
          status: res.statusCode,
        });
        return
      }
      if(req.body.prenom==undefined){
        res.status(res.statusCode).json({
          message: "prenom not found",
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
      if(req.body.cin==undefined){
        res.status(res.statusCode).json({
          message: "cin not found",
          error:true,
          status: res.statusCode,
        });
        return
      }
      if(req.body.equipe==undefined){
        res.status(res.statusCode).json({
          message: "equipe not found",
          error:true,
          status: res.statusCode,
        });
        return
      }
      if(req.body.club==undefined){
        res.status(res.statusCode).json({
          message: "club not found",
          error:true,
          status: res.statusCode,
        });
        return
      }
      if(req.body.motivation==undefined){
        res.status(res.statusCode).json({
          message: "motivation not found",
          error:true,
          status: res.statusCode,
        });
        return
      }
      if(req.body.ntel==undefined){
        res.status(res.statusCode).json({
          message: "ntel not found",
          error:true,
          status: res.statusCode,
        });
        return
      }
      if(req.body.classe==undefined){
        res.status(res.statusCode).json({
          message: "classe not found",
          error:true,
          status: res.statusCode,
        });
        return
      }
      //'http://127.0.0.1:5010/${newurlString}'
      client.query(`SELECT * FROM  demande  WHERE cin='${req.body.cin}'`, function  (err, result) {
        if (err){
            res.status(res.statusCode).json({
                errorCode: err.message,
                status: res.statusCode,
                
              });
            return
            }
        if(result.length==0){
          var nowTime = new Date()
          var id = crypto.randomBytes(16).toString('hex');

          var newDateFormated=`${nowTime.getFullYear()}-${nowTime.getMonth()}-${nowTime.getDay()} ${nowTime.getHours()}:${nowTime.getMinutes()}:${nowTime.getSeconds()}`
          client.query(` INSERT INTO demande (id_demande,cin,nom,prenom,classe,equipe,club,motivation,n_tel,date,email) 
          VALUES ('${id}','${req.body.cin}','${req.body.nom}','${req.body.prenom}','${req.body.classe}','${req.body.equipe}','${req.body.club}','${req.body.motivation}','${req.body.ntel}','${newDateFormated}','${req.body.email}')`,
           function (err, result) {
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
        }else{
          res.status(res.statusCode).json({
            message: "user already have request",
            error:true,
            status: res.statusCode,
        });
        }
      })
   
}
  
exports.getRequests=(req,res)=>{

    client.query(`SELECT 
    id_demande, demande.cin ,demande.nom,demande.prenom,demande.classe,demande.equipe,demande.club,demande.motivation,demande.n_tel,demande.date,demande.email
    FROM  membre RIGHT JOIN club on club.id_membre=membre.id_membre  RIGHT JOIN demande on demande.club=club.id_club WHERE membre.id_membre='${req.verified.user_auth.id_membre}'`, function  (err, result) {
        if (err){
            res.status(res.statusCode).json({
                errorCode: err.message,
                status: res.statusCode,
                
              });
            
            }else{
                res.status(res.statusCode).json({
                    message: "list of Requests",
                    data:result,
                    status: res.statusCode,
                });
            }
        })
}
exports.acceptOrDeleteRequests=(req,res)=>{

    if(req.body.option=="delete"){
        //;
        if(req.body.idDemande==undefined){
          res.status(res.statusCode).json({
            message: "idDemande not found",
            error:true,
            status: res.statusCode,
          });
          return
        }
        console.log(req.verified.user_auth.id_membre)
        client.query(`DELETE demande FROM demande JOIN club on club.id_club=demande.club   WHERE club.id_membre='${req.verified.user_auth.id_membre}' && id_demande='${req.body.idDemande}'`, function  (err, result) {
            if (err){
                res.status(res.statusCode).json({
                    errorCode: err,
                    status: res.statusCode,
                  });
                
                }else{
                  console.log(result)
                  if(result.affectedRows==0){
                    res.status(res.statusCode).json({
                      errorCode: "demande not found or you dont have acces to delete it",
                      status: res.statusCode,
                  });  
                  }else{
                    sendmail(req.body.email,"rejected")
                    res.status(res.statusCode).json({
                        errorCode: "demande is deleted",
                        status: res.statusCode,
                      });  
                  }
        
                }
            })

    }else{
      if(req.body.idDemande==undefined){
        res.status(res.statusCode).json({
          message: "idDemande not found",
          error:true,
          status: res.statusCode,
        });
        return
      }
        client.query(`SELECT * FROM  demande JOIN club on club.id_club=demande.club   WHERE club.id_membre='${req.verified.user_auth.id_membre}' && id_demande='${req.body.idDemande}'`, function  (err, result) {
            if (err){
                res.status(res.statusCode).json({
                    errorCode: err.message,
                    status: res.statusCode,
                    
                  });
                
                }else{
                    if(result.length==0 || result[0]==undefined){
                        res.status(res.statusCode).json({
                            errorCode: "demande not found or you dont have acces to delete it",
                            status: res.statusCode,
                    });  
                    }else{
                        client.query(`SELECT * FROM  membre  WHERE cin='${result[0].cin}'`, function  (err, resultzero) {
                            if (err){
                                res.status(res.statusCode).json({
                                    errorCode: err.message,
                                    status: res.statusCode,
                                });
                            }else{
                                if(resultzero.length==0 || resultzero[0]==undefined){
                                    //hedhi ken user mafamech awel mara chi kon andou compte fi site lezm ngedlou compte
                                    var id = crypto.randomBytes(16).toString('hex');
                                    client.query(`INSERT INTO membre 
                                    (id_membre,nom,prenom,n_tel,email,motdepasse,membreimage,cin) 
                                    VALUES('${id}','${result[0].nom}','${result[0].prenom}',${result[0].n_tel},'${result[0].email}','password','imageurl','${result[0].cin}')`, function  (err, resultone) {
                                        if (err){
                                            res.status(res.statusCode).json({
                                                errorIn:"INSERT INTO membre 1",
                                                errorCode: err,
                                                status: res.statusCode,
                                            });
                                        }else{
                                            client.query(`INSERT INTO liste_membre
                                            (id_club,cin_membre,role,equipe)
                                            VALUES('${result[0].club}','${result[0].cin}','1','${result[0].equipe}')
                                            `,(err, resulttwo)=>{
                                                if(err){
                                                    res.status(res.statusCode).json({
                                                        errorIn:"INSERT INTO liste_membre",
                                                        errorCode: err.message,
                                                        status: res.statusCode,
                                                    });
                                                }else{
                                                    sendmail(result[0].email,"aproved")
                                                    res.status(res.statusCode).json({
                                                        message: "membre accepted",
                                                        status: res.statusCode,
                                                    });
                                                }
                                            })
                                        }}
                                        )
                                }else{
         
                                    client.query(`INSERT INTO liste_membre
                                    (id_club,cin_membre,role,equipe)
                                    VALUES(${result[0].club},'${result[0].cin}',1,1)
                                    `,(err, resulttwo)=>{
                                        if(err){
                                            res.status(res.statusCode).json({
                                                errorIn:"INSERT INTO liste_membre if he is alredy membre",
                                                errorCode: err.message,
                                                status: res.statusCode,
                                            });
                                        }else{
                                            sendmail(result[0].email,"aproved")
                                            res.status(res.statusCode).json({
                                                message: "membre accepted",
                                                status: res.statusCode,
                                            });
                                        }
                                    })
                                }
                            }
                        })

                           
                        }
                }
            })

        }
}

const sendmail=(email,state)=>{
  console.log(email)
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'Cclub621@gmail.com',
          pass: 'club123456789'
        }
      });
      if(state=="aproved"){
        var mailOptions = {
          from: 'isetrades@gmail.com',
          to: email,
          subject: 'result',
          text:  "you are aproved to join our club your default password is password and login is your email if you alredy have account just sing in with your info"
        };
      }else{
        var mailOptions = {
          from: 'isetrades@gmail.com',
          to: email,
          subject: 'result',
          text: state
        };
      }

      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}
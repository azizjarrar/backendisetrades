var client = require('../../../db_connection')
const crypto = require("crypto");
var nodemailer = require('nodemailer');
const validator = require('../../middleware/validator')
/**************************************************************************/
/**************this part is responsible of all demmandes API***************/
/**************************************************************************/
exports.sendRequest = (req, res) => {
  const id = crypto.randomBytes(16).toString("hex");

  var newurlString = ""
  // reverse in image url '\'  to '/'
  if (req.file != undefined) {
    for (let i = 0; i < req.file.path.length; i++) {
      if (req.file.path[i] ==='\\') {
        newurlString += "/"
      } else {
        newurlString += req.file.path[i]
      }
    }
  }
  req.body.tel="52"
  if(validator(req.body,["tel","motivation","club","equipe","cin","email"],res)){
    return
  }
  client.query(`SELECT * FROM  user  WHERE cin=${client.escape(req.body.cin)}`, function (err, resultEtudiant) {
    if (err) {
      res.status(res.statusCode).json({
        errorCode: err.message,
        status: res.statusCode,

      });
      return
    } else {
      if (resultEtudiant.length ===0) {
        res.status(res.statusCode).json({
          message: "cin  not found",
          status: res.statusCode,

        });
      } else {
        
        client.query(`SELECT * FROM  demande_club  WHERE cin=${client.escape(req.body.cin)} && id_club=${client.escape(req.body.club)};`, function (err, result) {
          if (err) {
            res.status(res.statusCode).json({
              errorCode: err,

              status: res.statusCode,
            });
            return
          }
          if (result.length ===0) {
            //create current date
            var date = new Date()
            const datee=date.getFullYear()+"-"+(date.getMonth()+1-0)+"-"+date.getDate();
            const heure=date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
            const newDateFormated=datee+" "+heure;
            client.query(` INSERT INTO demande_club (id_demande,cin,statut,id_etudiant,equipe,id_club,motivation,date,email,tel) 
          VALUES ('${id}',${client.escape(req.body.cin)},"en attend",${client.escape(resultEtudiant[0].id_user)},${client.escape(req.body.equipe)},${client.escape(req.body.club)},${client.escape(req.body.motivation)} , ${client.escape(newDateFormated)} , ${client.escape(req.body.email)} ,${client.escape(req.body.tel)});`,
              function (err, result) {
                if (err) {
                  res.status(res.statusCode).json({
                    errorCode: err,
                    status: res.statusCode,

                  });
                } else {
                  res.status(res.statusCode).json({
                    message: "done",
                    data: result,
                    status: res.statusCode,
                  });
                }
              });
          } else {
            res.status(res.statusCode).json({
              message: "user already have request",
              error: true,
              status: res.statusCode,
            });
          }
        })
      }
    }
  })


}

exports.getRequests = (req, res) => {
  client.query(`SELECT user.cin,demande_club.id_demande,
    user.nom,user.prenom,club.nom_club,demande_club.motivation,user.age,user.sexe,demande_club.date,demande_club.id_club,demande_club.email,equipes.equipe 
    FROM demande_club  JOIN club on club.id_club=demande_club.id_club join user on user.cin=demande_club.cin JOIN equipes on id_equipe=demande_club.equipe
    WHERE demande_club.id_club=${req.body.id_club} and club.id_membre=${req.verified.user_auth.id_membre}
    ;`, function (err, result) {
    if (err) {
      res.status(res.statusCode).json({
        errorCode: err.message,
        status: res.statusCode,

      });

    } else {
      res.status(res.statusCode).json({
        message: "list of Requests",
        data: result,
        status: res.statusCode,
      });
    }
  })
}
exports.acceptOrDeleteRequests = (req, res) => {
  if(validator(req.body,["idDemande","option"],res)){
    return
  }
  const idmembre = Math.floor(Math.random() * 1000000000);
  if (req.body.option ==="delete") {
    //;
    if(validator(req.body,["idDemande"],res)){
      return
    }
    client.query(`DELETE demande_club FROM demande_club JOIN club on club.id_club=demande_club.id_club   WHERE club.id_membre='${req.verified.user_auth.id_membre}' && id_demande=${client.escape(req.body.idDemande)};`, function (err, result) {
      if (err) {
        res.status(res.statusCode).json({
          errorCode: err,
          status: res.statusCode,
        });

      } else {
        if (result.affectedRows ===0) {
          res.status(res.statusCode).json({
            errorCode: "demande_club not found or you dont have acces to delete it",
            status: res.statusCode,
          });
        } else {
          sendmail(req.body.email, "rejected")
          res.status(res.statusCode).json({
            errorCode: "demande_club is deleted",
            status: res.statusCode,
          });
        }

      }
    })

  } else {

    client.query(`SELECT * FROM  demande_club JOIN club on club.id_club=demande_club.id_club   WHERE club.id_membre='${req.verified.user_auth.id_membre}' && id_demande=${client.escape(req.body.idDemande)};`, function (err, result) {
      if (err) {
        res.status(res.statusCode).json({
          errorCode: err.message,
          status: res.statusCode,

        });

      } else {
        if (result.length ===0 || result[0] ===undefined) {
          res.status(res.statusCode).json({
            errorCode: "demande_club not found or you dont have acces to delete it",
            status: res.statusCode,
          });
        } else {
          client.query(`SELECT * FROM  membre  WHERE cin='${result[0].cin}';`, function (err, resultzero) {
            if (err) {
              res.status(res.statusCode).json({
                errorCode: err.message,
                status: res.statusCode,
              });
            } else {
              if (resultzero.length ===0 || resultzero[0] ===undefined) {
                //if this is the first time for user in any club we will create new membre
                client.query(`SELECT * FROM role_membre WHERE role='membre';`, (err, resultrole) => {
                  if (err) {
                    res.status(res.statusCode).json({
                      errorCode: err.message,
                      status: res.statusCode,
                    });
                    return
                  }
                  var randompassword = crypto.randomBytes(16).toString('hex');
                  if (resultrole ===undefined) {
                    res.status(res.statusCode).json({
                      errorCode: "role membre 404",
                      status: res.statusCode,
                    });
                    return
                  }
                  //create user
                  client.query(`INSERT INTO membre (tel,id_membre,role,email,motdepasse,membreimage,cin) 
                                      VALUES('${result[0].tel}','${idmembre}',${resultrole[0].id_role},'${result[0].email}',${client.escape(randompassword)},'imageurl',${result[0].cin});`, function (err, resultone) {
                    if (err) {
                      res.status(res.statusCode).json({
                        errorIn: "INSERT INTO membre 1",
                        errorCode: err,
                        status: res.statusCode,
                      });
                    } else {
                      //add user to list_membre here we found all users of  giving club
                      client.query(`INSERT INTO liste_membre
                                              (id_club,cin_membre,role,equipe)
                                              VALUES('${result[0].id_club}','${result[0].cin}','${resultrole[0].id_role}','${result[0].equipe}')
                                              `, (err, resulttwo) => {
                        if (err) {
                          res.status(res.statusCode).json({
                            errorIn: "INSERT INTO liste_membre",
                            errorCode: err.message,
                            status: res.statusCode,
                          });
                        } else {
                          //delete demmande after adding user
                          client.query(`DELETE demande_club FROM demande_club JOIN club on club.id_club=demande_club.id_club   WHERE club.id_membre='${req.verified.user_auth.id_membre}' && id_demande='${req.body.idDemande}';`, function (err, resultdelete) {
                            if (err) {
                              res.status(res.statusCode).json({
                                errorCode: err.message,
                                status: res.statusCode,
                              });
                            } else {
                              sendmail(result[0].email, "aproved",randompassword)
                              res.status(res.statusCode).json({
                                message: "membre accepted",
                                status: res.statusCode,
                              });
                            }
                          })
                        }
                      })
                    }
                  }
                  )
                })

              } else {
                //if its not his first time we will just add him to club
                client.query(`SELECT * FROM role_membre WHERE role='membre'`, (err, resultrole) => {
                  if (err) {
                    res.status(res.statusCode).json({
                      errorCode: err.message,
                      status: res.statusCode,
                    });
                    return
                  }
                  client.query(`INSERT INTO liste_membre
                                      (id_club,cin_membre,role,equipe)
                                      VALUES(${result[0].id_club},'${result[0].cin}','${resultrole[0].id_role}','${result[0].equipe}')
                                      `, (err, resulttwo) => {
                    if (err) {
                      res.status(res.statusCode).json({
                        errorCode: err,
                        status: res.statusCode,
                      });
                    } else {
                      client.query(`DELETE demande_club FROM demande_club JOIN club on club.id_club=demande_club.id_club   WHERE club.id_membre='${req.verified.user_auth.id_membre}' && id_demande='${req.body.idDemande}';`, function (err, resultdelete) {
                        if (err) {
                          res.status(res.statusCode).json({
                            errorCode: err.message,
                            status: res.statusCode,
                          });
                        } else {
                          sendmail(result[0].email, "aproved" , randompassword)
                          res.status(res.statusCode).json({
                            message: "membre accepted",
                            status: res.statusCode,
                          });
                        }
                      })
                    }
                  })
                }
                )
              }
            }
          })
        }
      }
    })

  }
}

const sendmail = (email, state , password) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'clubcelva89@gmail.com',
      pass: 'Celva123'
    }
  });
  if (state ==="aproved") {
    var mailOptions = {
      from: 'isetrades@gmail.com',
      to: email,
      subject: 'result',
      text: "you are aproved to join our club your default password is "+password +"and login is your email if you alredy have account just sing in with your info"
    };
  } else {
    var mailOptions = {
      from: 'isetrades@gmail.com',
      to: email,
      subject: 'result',
      text: "you are rejected to join  club"
    };
  }


  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
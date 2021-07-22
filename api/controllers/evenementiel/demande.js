var client = require('../../../db_connection')
const crypto = require("crypto");
var nodemailer = require('nodemailer');

exports.sendRequest = (req, res) => {
  const id = crypto.randomBytes(16).toString("hex");

  var newurlString = ""
  if (req.file != undefined) {
    for (let i = 0; i < req.file.path.length; i++) {
      if (req.file.path[i] == '\\') {
        newurlString += "/"
      } else {
        newurlString += req.file.path[i]
      }
    }
  }

  if (req.body.email == undefined) {
    res.status(res.statusCode).json({
      message: "email not found",
      error: true,
      status: res.statusCode,
    });
    return
  }
  if (req.body.cin == undefined) {
    res.status(res.statusCode).json({
      message: "cin not found",
      error: true,
      status: res.statusCode,
    });
    return
  }
  if (req.body.equipe == undefined) {
    res.status(res.statusCode).json({
      message: "equipe not found",
      error: true,
      status: res.statusCode,
    });
    return
  }
  if (req.body.club == undefined) {
    res.status(res.statusCode).json({
      message: "club not found",
      error: true,
      status: res.statusCode,
    });
    return
  }
  if (req.body.motivation == undefined) {
    res.status(res.statusCode).json({
      message: "motivation not found",
      error: true,
      status: res.statusCode,
    });
    return
  }
  if (req.body.tel == undefined) {
    res.status(res.statusCode).json({
      message: "numero telephone not found",
      error: true,
      status: res.statusCode,
    });
    return
  }

  client.query(`SELECT * FROM  user  WHERE cin='${req.body.cin}'`, function (err, resultEtudiant) {
    if (err) {
      res.status(res.statusCode).json({
        errorCode: err.message,
        status: res.statusCode,

      });
      return
    } else {
      if (resultEtudiant.length == 0) {
        res.status(res.statusCode).json({
          message: "mkch m9ayed fil fac",
          status: res.statusCode,

        });
      } else {
        
        client.query(`SELECT * FROM  demande_club  WHERE cin='${req.body.cin}' && id_club='${req.body.club}'`, function (err, result) {
          if (err) {
            res.status(res.statusCode).json({
              errorCode: err,

              status: res.statusCode,
            });
            return
          }
          if (result.length == 0) {
            var date = new Date()
            //ngedha
            const datee=date.getFullYear()+"-"+(date.getMonth()+1-0)+"-"+date.getDate();
            const heure=date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
            const newDateFormated=datee+" "+heure;
           // var newDateFormated = `${nowTime.getFullYear()}-${nowTime.getMonth().length == 1 ? nowTime.getMonth() + "0" : nowTime.getMonth()}-${nowTime.getDay().length == 1 ? nowTime.getDay() + "0" : nowTime.getDay()} ${nowTime.getHours()}:${nowTime.getMinutes()}:${nowTime.getSeconds()}`
           // var newDateFormated = "2021-05-02"
            client.query(` INSERT INTO demande_club (id_demande,cin,statut,id_etudiant,equipe,id_club,motivation,date,email,tel) 
          VALUES ('${id}',${req.body.cin},"en attend",${resultEtudiant[0].id_user},${req.body.equipe},${req.body.club},'${req.body.motivation}','${newDateFormated}','${req.body.email}','${req.body.tel}')`,
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
    `, function (err, result) {
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

  const idmembre = Math.floor(Math.random() * 1000000000);
  if (req.body.option == "delete") {
    //;
    if (req.body.idDemande == undefined) {
      res.status(res.statusCode).json({
        message: "idDemande not found",
        error: true,
        status: res.statusCode,
      });
      return
    }
    client.query(`DELETE demande_club FROM demande_club JOIN club on club.id_club=demande_club.id_club   WHERE club.id_membre='${req.verified.user_auth.id_membre}' && id_demande='${req.body.idDemande}'`, function (err, result) {
      if (err) {
        res.status(res.statusCode).json({
          errorCode: err,
          status: res.statusCode,
        });

      } else {
        if (result.affectedRows == 0) {
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
    if (req.body.idDemande == undefined) {
      res.status(res.statusCode).json({
        message: "idDemande not found",
        error: true,
        status: res.statusCode,
      });
      return
    }
    client.query(`SELECT * FROM  demande_club JOIN club on club.id_club=demande_club.id_club   WHERE club.id_membre='${req.verified.user_auth.id_membre}' && id_demande='${req.body.idDemande}'`, function (err, result) {
      if (err) {
        res.status(res.statusCode).json({
          errorCode: err.message,
          status: res.statusCode,

        });

      } else {
        if (result.length == 0 || result[0] == undefined) {
          res.status(res.statusCode).json({
            errorCode: "demande_club not found or you dont have acces to delete it",
            status: res.statusCode,
          });
        } else {
          client.query(`SELECT * FROM  membre  WHERE cin='${result[0].cin}'`, function (err, resultzero) {
            if (err) {
              res.status(res.statusCode).json({
                errorCode: err.message,
                status: res.statusCode,
              });
            } else {
              if (resultzero.length == 0 || resultzero[0] == undefined) {
                //hedhi ken user mafamech awel mara chi kon andou compte fi site lezm ngedlou compte
                client.query(`SELECT * FROM role_membre WHERE role='membre'`, (err, resultrole) => {
                  if (err) {
                    res.status(res.statusCode).json({
                      errorCode: err.message,
                      status: res.statusCode,
                    });
                    return
                  }
                  var randompassword = crypto.randomBytes(16).toString('hex');
                  if (resultrole == undefined) {
                    res.status(res.statusCode).json({
                      errorCode: "role membre 404",
                      status: res.statusCode,
                    });
                    return
                  }
                  client.query(`INSERT INTO membre (tel,id_membre,role,email,motdepasse,membreimage,cin) 
                                      VALUES('${result[0].tel}','${idmembre}',${resultrole[0].id_role},'${result[0].email}','${randompassword}','imageurl',${result[0].cin})`, function (err, resultone) {
                    if (err) {
                      res.status(res.statusCode).json({
                        errorIn: "INSERT INTO membre 1",
                        errorCode: err,
                        status: res.statusCode,
                      });
                    } else {
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
                          client.query(`DELETE demande_club FROM demande_club JOIN club on club.id_club=demande_club.id_club   WHERE club.id_membre='${req.verified.user_auth.id_membre}' && id_demande='${req.body.idDemande}'`, function (err, resultdelete) {
                            if (err) {
                              res.status(res.statusCode).json({
                                errorCode: err.message,
                                status: res.statusCode,
                              });
                            } else {
                              sendmail(result[0].email, "aproved")
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
                      client.query(`DELETE demande_club FROM demande_club JOIN club on club.id_club=demande_club.id_club   WHERE club.id_membre='${req.verified.user_auth.id_membre}' && id_demande='${req.body.idDemande}'`, function (err, resultdelete) {
                        if (err) {
                          res.status(res.statusCode).json({
                            errorCode: err.message,
                            status: res.statusCode,
                          });
                        } else {
                          sendmail(result[0].email, "aproved")
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

const sendmail = (email, state) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'Cclub621@gmail.com',
      pass: 'club123456789'
    }
  });
  if (state == "aproved") {
    var mailOptions = {
      from: 'isetrades@gmail.com',
      to: email,
      subject: 'result',
      text: "you are aproved to join our club your default password is password and login is your email if you alredy have account just sing in with your info"
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
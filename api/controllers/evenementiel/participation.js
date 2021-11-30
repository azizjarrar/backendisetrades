var client = require('../../../db_connection')
var nodemailer = require('nodemailer');
const validator = require('../../middleware/validator')
const responseSender = require("../../middleware/responseSender")

const { UPDATED, NOT_FOUND, DELETED, DONE, ALREADY_EXISTS } = require('./messages')

/**************************************************************************/
/**************this part is responsible for all participation APIS ********/
/**************************************************************************/
exports.addParticipation = (req, res) => {
  if (validator(req.body, ["id_event"], res)) {
    return
  }
  client.query(`SELECT * FROM  participation  WHERE  id_event=${client.escape(req.body.id_event)} and id_membre=${client.escape(req.verified.user_auth.id_membre)};`, (err, result) => {
    if (err) {
      responseSender(res, { error: true, errorMessage: err.message })
      return
    } else {
      if (result.length != 0) {
        responseSender(res, { message: ALREADY_EXISTS, error: true })
      } else {
        client.query(`INSERT INTO participation(id_event,id_membre,statut) 
                VALUES('${req.body.id_event}','${req.verified.user_auth.id_membre}','pas confirmé') 
                `, (err, result) => {
          if (err) {
            responseSender(res, { error: true, errorMessage: err.message })
          } else {
            responseSender(res, { message: DONE, })
          }
        })

      }
    }
  })
}
exports.getAllParticipation = (req, res) => {
  if (validator(req.body, ["id_event"], res)) {
    return
  }
  client.query(`SELECT  membre.email,participation.statut,participation.id_participation,user.nom,user.prenom,membre.cin,membre.tel,participation.id_event FROM  participation   JOIN membre on membre.id_membre=participation.id_membre JOIN user on membre.cin=user.cin WHERE  id_event=${client.escape(req.body.id_event)} ;`, (err, result) => {
    if (err) {
      responseSender(res, { error: true, errorMessage: err.message })
    } else {
      responseSender(res, { data: result, nombreofparticipation: result.length })
    }
  })
}
exports.updatestatut = (req, res) => {
  if (validator(req.body, ["event_name", "email", "id_participation"], res)) {
    return
  }
  client.query(`UPDATE participation participation SET statut='confirmé' where id_participation=${client.escape(req.body.id_participation)};`, (err, result) => {
    if (err) {
      responseSender(res, { error: true, errorMessage: err.message })
    } else {
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
      responseSender(res, { message: "statut " + UPDATED, status: res.statusCode })
    }
  })
}
exports.deleteParticipation = (req, res) => {
  if (validator(req.body, ["id_participation"], res)) {
    return
  }
  client.query(`DELETE FROM participation  where id_participation=${client.escape(req.body.id_participation)};`, (err, result) => {
    if (err) {
      responseSender(res, { error: true, errorMessage: err.message })

    } else {
      if (result.affectedRows == 0) {
        responseSender(res, { error: true, message: NOT_FOUND })
      } else {
        responseSender(res, { message: DELETED })
      }
    }
  })
}

exports.getOneUserParti = (req, res) => {
  client.query(`SELECT  event.date_debut,event.titre_event,participation.statut,membre.email,participation.id_participation,user.nom,user.prenom,membre.cin,membre.tel,participation.id_event FROM  participation   JOIN membre on membre.id_membre=participation.id_membre JOIN user on membre.cin=user.cin JOIN event on event.id_event=participation.id_event WHERE  participation.id_membre=${req.verified.user_auth.id_membre} ;`, (err, result) => {
    if (err) {
      responseSender(res, { error: true, errorMessage: err.message })
    } else {
      responseSender(res, { message: DONE, data: result, nombreofparticipation: result.length, })
    }
  })
}
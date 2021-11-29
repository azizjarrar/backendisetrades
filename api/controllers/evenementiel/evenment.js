var client = require('../../../db_connection')
const validator = require('../../middleware/validator')
const { WAS_ADD, UPDATED, DELETED, AUTHORIZED_OR_NOT_FOUND } = require('./messages')
const responseSender = require("../../middleware/responseSender")


/**************************************************************************/
/**************this part is responsible of all events API******************/
/**************************************************************************/
exports.getevents = (req, res) => {
  client.query(`SELECT event.titre_event, event.url_image,club.nom_club,event.url_event,event.heure_fin,event.heure_debut,event.date_fin,event.date_debut,event.statut,event.description,club.id_club,event.id_event FROM event JOIN club on club.id_club=event.id_club ORDER BY event.date_debut DESC , event.heure_debut DESC;`, (err, result) => {
    if (err) {
      responseSender(res, { error: true, errorMessage: err.message })
    } else {
      responseSender(res, { data: result})
    }
  })
}

exports.addevent = (req, res) => {
  if (validator(req.body, ["id_club", "url_event", "statut", "heure_fin", "heure_fin", "heure_debut", "date_fin", "date_debut", "description"], res)) {
    return
  }
  var newurlString = ""
  if (req.file != undefined) {
    for (let i = 0; i < req.file.path.length; i++) {
      if (req.file.path[i] == '\\') {
        newurlString += "/"
      } else {
        newurlString += req.file.path[i]
      }
    }
  } else {
    newurlString = undefined
  }
  client.query(`SELECT * FROM membre JOIN club  ON club.id_membre=membre.id_membre WHERE club.id_membre=${req.verified.user_auth.id_membre} and  club.id_club=${client.escape(req.body.id_club)};`, (err, result) => {

    if (err) {
      responseSender(res, { error: true, errorMessage: err.message })
      return
    }

    if (result.length != 0 || result[0] != undefined) {
      client.query(`INSERT INTO event(titre_event,description,date_debut,date_fin,heure_debut,heure_fin,statut,url_image,url_event,id_membre,id_club) VALUES(${client.escape(req.body.titre_event)},${client.escape(req.body.description)},${client.escape(req.body.date_debut)},${client.escape(req.body.date_fin)},${client.escape(req.body.heure_debut)},${client.escape(req.body.heure_fin)},${client.escape(req.body.statut)},${client.escape(newurlString)},${client.escape(req.body.url_event)},${client.escape(req.verified.user_auth.id_membre)},${client.escape(req.body.id_club)})
            ;`, (err, result) => {
        if (err) {
          responseSender(res, { error: true, errorMessage: err.message })
        } else {
          responseSender(res, { message: "event " + WAS_ADD })
        }
      })
    } else {
      responseSender(res, { message: AUTHORIZED_OR_NOT_FOUND})
    }
  })

}
exports.getClubEvents = (req, res) => {
  if (validator(req.body, ["id_club"], res)) {
    return
  }
  client.query(`SELECT  event.titre_event,event.url_image,club.nom_club,event.url_event,event.heure_fin,event.heure_debut,event.date_fin,event.date_debut,event.statut,event.description,club.id_club,event.id_event FROM event JOIN club on club.id_club=event.id_club WHERE club.id_club=${client.escape(req.body.id_club)};`, (err, result) => {
    if (err) {
      responseSender(res, { error: true, errorMessage: err.message })
    } else {
      responseSender(res, { data: result})
    }
  })
}


exports.deleteEvent = (req, res) => {
  if (validator(req.body, ["id_event"], res)) {
    return
  }

  client.query(`DELETE FROM participation  where id_event=${client.escape(req.body.id_event)}`, (err, result) => {
    if (err) {
      responseSender(res, { error: true, errorMessage: err.message })
    } else {
      client.query(`DELETE   event FROM event JOIN club ON event.id_club=club.id_club WHERE event.id_event=${client.escape(req.body.id_event)} AND event.id_membre=${req.verified.user_auth.id_membre} OR event.id_event=${client.escape(req.body.id_event)} AND club.id_membre=${req.verified.user_auth.id_membre};`, (err, result) => {
        if (err) {
          responseSender(res, { error: true, errorMessage: err.message })
        } else {
          responseSender(res, { message: DELETED })

        }
      })
    }
  })

}
exports.getOneEvent = (req, res) => {

  if (validator(req.body, ["id_event"], res)) {
    return
  }

  client.query(`SELECT  *,event.description  from event join club on club.id_club=event.id_club where id_event=${client.escape(req.body.id_event)};`, (err, result) => {
    if (err) {
      responseSender(res, { error: true, errorMessage: err.message })
    } else {
      responseSender(res, { data: result})
    }
  })
}
exports.updateEvent = (req, res) => {
  if (validator(req.body, ["id_event"], res)) {
    return
  }

  client.query(`SELECT  club.id_membre as idAdminClub,event.id_membre as idOfCreatorOfEvent FROM event JOIN club on club.id_club=event.id_club where id_event=${client.escape(req.body.id_event)} LIMIT 1;`, (err, result) => {
    if (err) {
      responseSender(res, { error: true, errorMessage: err.message })
    } else {
      if (req.verified.user_auth.id_membre === result[0].idAdminClub || req.verified.user_auth.id_membre === result[0].idOfCreatorOfEvent) {
        const { titre_event, description, date_debut, date_fin, heure_debut, heure_fin, statu, url_event, url_image } = req.body
        let queryString = `${titre_event != undefined ? "titre_event=" + "'" + titre_event + "'" : ''} ${description != undefined ? "description=" + "'" + description + "'" : ''}  ${date_debut != undefined ? "date_debut=" + "'" + date_debut + "'" : ''} ${date_fin != undefined ? "date_fin=" + "'" + date_fin + "'" : ''} ${heure_debut != undefined ? "heure_debut=" + "'" + heure_debut + "'" : ''} ${heure_fin != undefined ? "heure_fin=" + "'" + heure_fin + "'" : ''} ${statu != undefined ? "statut=" + "'" + statu + "'" : ''} ${url_event != undefined ? "url_event=" + "'" + url_event + "'" : ''} ${url_image != undefined ? "url_image=" + "'" + url_image + "'" : ''}`
        for (let i = 0; i < queryString.length - 1; i++) {
          if (queryString[i] == " " && queryString[i + 1] != " " && queryString[0] != " ") {
            queryString = queryString.replace(" ", ",")
          }
        }
        let query = `UPDATE event SET ${queryString} where id_event=${client.escape(req.body.id_event)};`;
        client.query(query, (err, result) => {
          if (err) {
            responseSender(res, { error: true, errorMessage: err.message })
          } else {
            responseSender(res, { message: UPDATED, data: result})
          }
        })
      } else {
        responseSender(res, { status: res.statusCode, message: AUTHORIZED_OR_NOT_FOUND})
      }
    }
  })
}
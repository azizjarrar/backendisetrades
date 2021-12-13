
var client = require('../../../db_connection')
const validator = require('../../middleware/validator')
const { DELETED, AUTHORIZED_OR_NOT_FOUND, WAS_ADD } = require('./messages')
const responseSender = require("../../middleware/responseSender")

/**************************************************************************/
/**************this part is responsible of all calander API****************/
/**************************************************************************/
exports.addcalender = (req, res) => {
  if (validator(req.body, ["titre", "description", "date", "temps", "id_club"], res)) {
    return
  }
  client.query(`INSERT INTO calendrier(titre,description,date,temps,id_club) VALUES(${client.escape(req.body.titre)},${client.escape(req.body.description)},${client.escape(req.body.date)},${client.escape(req.body.temps)},${client.escape(req.body.id_club)});`, (err, result) => {
    if (err) {
      responseSender(res, { error: true, errorMessage: err.message })
    } else {
      responseSender(res, { message: WAS_ADD })
    }
  })

}
exports.getcalender = (req, res) => {
  if (validator(req.body, ["id_club"], res)) {
    return
  }
  client.query(`SELECT *  FROM calendrier where id_club=${client.escape(req.body.id_club)} ORDER BY calendrier.date DESC , calendrier.temps DESC;`, (err, result) => {
    if (err) {
      responseSender(res, { error: true, errorMessage: err.message })
    } else {
      responseSender(res, { data: result, })
    }
  })
}
exports.deletecalender = (req, res) => {
  if (validator(req.body, ["id_calendrier"], res)) {
    return
  }
  client.query(`DELETE calendrier FROM calendrier JOIN club ON calendrier.id_club=club.id_club WHERE id_calendrier='${client.escape(req.body.id_calendrier)}' AND club.id_membre='${req.verified.user_auth.id_membre}';`, (err, result) => {
    if (err) {
      responseSender(res, { error: true, errorMessage: err.message })
    } else {
      if (result.affectedRows != 0) {
        responseSender(res, { message: DELETED, data: result })
      } else {
        responseSender(res, { message: AUTHORIZED_OR_NOT_FOUND })
      }
    }
  })
}
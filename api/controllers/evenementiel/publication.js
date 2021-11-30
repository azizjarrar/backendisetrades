
var client = require('../../../db_connection')
const validator = require('../../middleware/validator')
const responseSender = require("../../middleware/responseSender")
const { WAS_ADD, AUTHORIZED_OR_NOT_FOUND, DELETED } = require('./messages')


/**************************************************************************/
/**************this part is responsible for all posts APIS ****************/
/**************************************************************************/

exports.getposts = (req, res) => {
  if (validator(req.body, ["idclub"], res)) {
    return
  }
  client.query(`SELECT user.nom,user.prenom,publication_club.description,publication_club.date,publication_club.heure,publication_club.url_image,publication_club.id_publication,membre.membreimage
    FROM  publication_club JOIN membre on publication_club.id_membre=membre.id_membre JOIN user on membre.cin=user.cin  WHERE id_club='${req.body.idclub}'  
    ORDER BY publication_club.date ASC  , publication_club.heure DESC
    ;`, (err, result) => {
    if (err) {
      responseSender(res, { error: true, errorMessage: err.message })
    } else {
      responseSender(res, { data: result, })
    }
  })
}
exports.addpost = (req, res) => {
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
  if (validator(req.body, ["description", "idclub"], res)) {
    return
  }
  const date = new Date();
  const datee = date.getFullYear() + "-" + (date.getMonth() + 1 - 0) + "-" + date.getDate();
  const heure = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  client.query(`INSERT INTO publication_club
    (date,heure,id_membre,description,id_club,url_image) 
    VALUES ('${datee}','${heure}','${req.verified.user_auth.id_membre}',${client.escape(req.body.description)},${client.escape(req.body.idclub)},${client.escape(newurlString)});`, (err, result) => {
    if (err) {
      responseSender(res, { error: true, errorMessage: err.message })
    } else {
      responseSender(res, { data: result, })
    }
  })
}
exports.addComment = (req, res) => {
  const date = new Date();
  const datee = date.getFullYear() + "-" + (date.getMonth() + 1 - 0) + "-" + date.getDate();
  const heure = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  if (validator(req.body, ["id_publication", "description"], res)) {
    return
  }
  client.query(`INSERT INTO commentaire_publication (date,heure,id_publication,description,id_membre) VALUES ('${datee}','${heure}',${client.escape(req.body.id_publication)},${client.escape(req.body.description)},${client.escape(req.verified.user_auth.id_membre)}) ;`, (err, result) => {
    if (err) {
      responseSender(res, { error: true, errorMessage: err.message })
    } else {
      responseSender(res, { message: "comment " + WAS_ADD, data: result, })
    }
  })
}
exports.getComments = (req, res) => {
  if (validator(req.body, ["idpublication"], res)) {
    return
  }
  client.query(`SELECT  
        user.nom,user.prenom,commentaire_publication.description,commentaire_publication.id_commentaire,commentaire_publication.heure,commentaire_publication.date,membre.membreimage
        FROM
        publication_club JOIN commentaire_publication on commentaire_publication.id_publication=publication_club.id_publication
        JOIN membre on membre.id_membre=commentaire_publication.id_membre JOIN user on membre.cin=user.cin
          WHERE publication_club.id_publication='${req.body.idpublication}' 
          ORDER BY commentaire_publication.date DESC , commentaire_publication.heure DESC
          ;`, (err, result) => {
    if (err) {
      responseSender(res, { error: true, errorMessage: err.message })
    } else {
      responseSender(res, { data: result, })
    }
  })
}
exports.deletePost = (req, res) => {
  if (validator(req.body, ["id_publication"], res)) {
    return
  }
  client.query(`SELECT  * FROM publication_club JOIN club ON publication_club.id_club=club.id_club WHERE id_publication='${req.body.id_publication}' AND publication_club.id_membre='${req.verified.user_auth.id_membre}' OR publication_club.id_publication=${client.escape(req.body.id_publication)} AND club.id_membre='${req.verified.user_auth.id_membre}';`, (err, result) => {
    if (err) {
      responseSender(res, { error: true, errorMessage: err.message })
    } else {
      if (result[0] == undefined) {
        responseSender(res, { error: true, message: AUTHORIZED_OR_NOT_FOUND, })
      } else {
        client.query(`DELETE commentaire_publication FROM commentaire_publication where id_publication=${result[0].id_publication}`, (err, resuldelCommen) => {
          if (err) {
            responseSender(res, { error: true, errorMessage: err.message })
          } else {
            client.query(`DELETE publication_club FROM publication_club where id_publication=${result[0].id_publication}`, (err, resuldeletePost) => {
              if (err) {
                responseSender(res, { error: true, errorMessage: err.message })
              } else {
                responseSender(res, { message: "post  " + DELETED })
              }
            })
          }
        })
      }

    }
  })
}
exports.deleteComment = (req, res) => {
  if (validator(req.body, ["id_commentaire"], res)) {
    return
  }
  client.query(`DELETE commentaire_publication FROM commentaire_publication  WHERE id_commentaire=${req.body.id_commentaire} AND id_membre=${req.verified.user_auth.id_membre}`, (err, result) => {
    if (err) {
      responseSender(res, { error: true, errorMessage: err.message })
    } else {
      if (result.affectedRows != 0) {
        responseSender(res, { message: "calandrier " + DELETED, data: result })
      } else {
        responseSender(res, { error: true, message: " calendrier " + AUTHORIZED_OR_NOT_FOUND })
      }
    }
  })
}
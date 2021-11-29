var client = require('../../../db_connection')
const validator = require('../../middleware/validator')
const responseSender = require("../../middleware/responseSender")

/**************************************************************************/
/**************this part is responsible of all club API********************/
/**************************************************************************/
exports.getclubs=(req,res)=>{
    client.query(`SELECT *  FROM  club ;`,(err,result)=>{
        if (err){
            responseSender(res, { error: true, errorMessage: err.message })
        }else{
            responseSender(res, {data:result,})
        }
    })

}

exports.getuserClubs=(req,res)=>{
        client.query(`SELECT club.id_club,club.nom_club,club.id_membre  AS idadminclub FROM  membre JOIN liste_membre on  liste_membre.cin_membre=membre.cin JOIN club on club.id_club=liste_membre.id_club WHERE membre.id_membre='${req.verified.user_auth.id_membre}';`,(err,result)=>{
        if (err){
            responseSender(res, { error: true, errorMessage: err.message })
        }else{
            responseSender(res, {data:result})
        }
    })
}
/*not Used */
exports.getClubYouAreAdminIn=(req,res)=>{
    client.query(`SELECT club.id_club,club.nom_club  FROM  club join membre on membre.id_membre=club.id_membre where club.id_membre=${client.escape(req.verified.user_auth.id_membre)};`,(err,result)=>{
        if (err){
            responseSender(res, { error: true, errorMessage: err.message })
        }else{
            responseSender(res, {message: "club you are admin in",data:result})
        }
    })
}

exports.isAdmin=(req,res)=>{
      if(validator(req.body,["id_club"],res)){
        return
      }
    client.query(`SELECT *  FROM  club join membre on membre.id_membre=club.id_membre where club.id_membre=${client.escape(req.verified.user_auth.id_membre)} && club.id_club=${client.escape(req.body.id_club)};`,(err,result)=>{
        if (err){
                responseSender(res, { error: true, errorMessage: err.message })
        }else{
            if(result.length==1){
                responseSender(res, {message: "club you are admin in",isAdmin:true})
            }else{
                responseSender(res, {message: "club you are admin in",isAdmin:false,})
            }
        }
    })
}
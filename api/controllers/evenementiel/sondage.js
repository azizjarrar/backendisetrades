var client = require('../../../db_connection')
const validator = require('../../middleware/validator')
const {UPDATED ,WAS_ADD,DELETED,AUTHORIZED_OR_NOT_FOUND} = require('./messages')

const responseSender = require("../../middleware/responseSender")

/**************************************************************************/
/**************this part is responsible for all poll APIS *****************/
/**************************************************************************/
exports.getsondage=async (req,res)=>{

    client.query(`SELECT user.nom,user.prenom,sondage.id_sondage,sondage.date_sondage,sondage.heure_sondage,sondage.titre,sondage.id_sondage FROM  sondage JOIN membre on sondage.id_membre=membre.id_membre JOIN user on membre.cin=user.cin  WHERE id_club='${req.body.idclub}' 
    ORDER BY sondage.date_sondage DESC ;`,(err,result)=>{
        if (err){
            responseSender(res,{error: true,errorMessage: err.message})
        }else{
            responseSender(res,{data:result,})
        }
    })
}
exports.addsondage=(req,res)=>{
    const date = new Date();
    const datee=date.getFullYear()+"-"+(date.getMonth()+1-0)+"-"+date.getDate();
    const heure=date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    if (validator(req.body, ["titre","idclub"], res)) {
        return
      }
    client.query(`INSERT INTO sondage
    (date_sondage,heure_sondage,id_membre,titre,id_club) 
    VALUES ('${datee}','${heure}','${req.verified.user_auth.id_membre}',${client.escape(req.body.titre)},${client.escape(req.body.idclub)});`,(err,result)=>{
        if (err){
            responseSender(res,{error: true,errorMessage: err.message})
        }else{
            responseSender(res,{data:result})
        }
    })
}
exports.addVote=(req,res)=>{
      if (validator(req.body, ["statut","idsondage"], res)) {
        return
      }
    client.query(`INSERT INTO vote_sondage (id_membre,statut,id_sondage) VALUES ('${req.verified.user_auth.id_membre}',${client.escape(req.body.statut)},${client.escape(req.body.idsondage)};) `,(err,result)=>{
        if (err){
            if(err.errno=="1062"){
                let statut=0
                if(req.body.statut==true || req.body.statut=="true"){
                    statut=1
                }else{
                    statut=0
                }
                client.query(`UPDATE vote_sondage  SET statut=${statut}  WHERE id_sondage='${req.body.idsondage}'`,async (err,result)=>{
                    if (err){
                        responseSender(res,{error: true,errorMessage: err.message})
                    }else{
                        responseSender(res,{message: "sondage "+UPDATED,status: res.statusCode})
                    }
                })
            }else{
                responseSender(res,{error: true,errorMessage: err.message})
            }
 
        }else{
            responseSender(res,{message: WAS_ADD,data:result,})
        }
    })
}
exports.getVotes=(req,res)=>{
    if (validator(req.body, ["idsondage"], res)) {
        return
      }
    client.query(`SELECT  count(statut) AS NumberOfVotes,statut  FROM  vote_sondage  WHERE id_sondage=${client.escape(req.body.idsondage)} GROUP BY statut ORDER BY statut;`,(err,result)=>{
        if (err){
            responseSender(res,{error: true,errorMessage: err.message})
        }else{
            if(result.length==0){
                responseSender(res,{message: "votes",NumberOfVotesFalse:0,NumberOfVotesTrue:0})

            }else if(result[0]==undefined || result[1]==undefined){
                if(result[0].statut==1){
                    responseSender(res,{message: "votes",NumberOfVotesFalse:0,NumberOfVotesTrue:result[0].NumberOfVotes})
                }else{
                    responseSender(res,{message: "votes",NumberOfVotesFalse:result[0].NumberOfVotes,NumberOfVotesTrue:0})
                }
            }
            else{
                responseSender(res,{message: "votes",NumberOfVotesFalse:result[0]==undefined?0:result[0].NumberOfVotes,NumberOfVotesTrue:result[1]==undefined?0:result[1].NumberOfVotes})
            }
        }
    })
}

exports.getVote=(req,res)=>{
    if (validator(req.body, ["statut"], res)) {
        return
      }
    client.query(`SELECT count (id_sondage)  FROM  vote_sondage WHERE statut=${client.escape(req.body.statut)} ;`,(err,result)=>{
        if (err){
            responseSender(res,{error: true,errorMessage: err.message})

        }else{
            responseSender(res,{data:result,})
        }
    })
}
exports.deletesondage=(req,res)=>{
    if (validator(req.body, ["idsondage"], res)) {
        return
      }    
    client.query(`SELECT  * FROM sondage JOIN club ON sondage.id_club=club.id_club WHERE id_sondage=${client.escape(req.body.idsondage)} AND sondage.id_membre='${req.verified.user_auth.id_membre}' OR id_sondage=${client.escape(req.body.idsondage)} AND club.id_membre='${req.verified.user_auth.id_membre}'`,(err,result)=>{
        if (err){
            responseSender(res,{error: true,errorMessage: err.message})

        }else{
            if(result[0]==undefined){
                responseSender(res,{error:true,message: AUTHORIZED_OR_NOT_FOUND,})
            }else{
                client.query(`DELETE vote_sondage FROM vote_sondage where id_sondage=${result[0].id_sondage}`,(err,resuldelCommen)=>{
                    if (err){
                        responseSender(res,{error: true,errorMessage: err.message})
                    }else{
                        client.query(`DELETE sondage FROM sondage where id_sondage=${result[0].id_sondage}`,(err,resuldeletePost)=>{
                            if (err){
                                responseSender(res,{error: true,errorMessage: err.message})
                            }else{
                                responseSender(res,{message: "sondage "+DELETED,})
                            }
                        })
                    }
                })
            }
        }   
    })
}
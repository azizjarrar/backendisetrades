var client = require('../../../db_connection')
//id_membre
exports.getsondage=(req,res)=>{
    client.query(`SELECT user.nom,user.prenom,sondage.id_sondage,sondage.date_sondage,sondage.heure_sondage,sondage.titre,sondage.id_sondage FROM  sondage JOIN membre on sondage.id_membre=membre.id_membre JOIN user on membre.cin=user.cin  WHERE id_club='${req.body.idclub}' 
    ORDER BY sondage.date_sondage DESC
    `,(err,result)=>{
        if (err){
            res.status(res.statusCode).json({
                errorCode: err.message,
                status: res.statusCode,
              });
        }else{
            res.status(res.statusCode).json({
                message: "club",
                data:result,
              });
        }
    })
}
exports.addsondage=(req,res)=>{
    const date = new Date();
    const datee=date.getFullYear()+"-"+(date.getMonth()+1-0)+"-"+date.getDate();
    const heure=date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    client.query(`INSERT INTO sondage
    (date_sondage,heure_sondage,id_membre,titre,id_club) 
    VALUES ('${datee}','${heure}','${req.verified.user_auth.id_membre}','${req.body.titre}','${req.body.idclub}') `,(err,result)=>{
        if (err){
            res.status(res.statusCode).json({
                errorCode: err.message,
                status: res.statusCode,
              });
        }else{
            res.status(res.statusCode).json({
                message: "sondage was added",
                data:result,
              });
        }
    })
}
exports.addVote=(req,res)=>{
    if (req.body.idsondage == undefined) {
        res.status(res.statusCode).json({
          message: "idsondage not found",
          error: true,
          status: res.statusCode,
        });
        return
      }

      if (req.body.statut == undefined) {
        res.status(res.statusCode).json({
          message: "statut not found",
          error: true,
          status: res.statusCode,
        });
        return
      }
    client.query(`INSERT INTO vote_sondage
    (id_membre,statut,id_sondage) 
    VALUES ('${req.verified.user_auth.id_membre}',${req.body.statut},'${req.body.idsondage}') `,(err,result)=>{
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
                        res.status(res.statusCode).json({
                            errorCode: err.message,
                            status: res.statusCode,
                          });
                    }else{
                        res.status(res.statusCode).json({
                            message: "sondage was updated was changed",
                            status: res.statusCode,
                          });
                    }
                })
            }else{
                res.status(res.statusCode).json({
                    errorCode: err,
                    status: res.statusCode,
                  });
            }
 
        }else{
            res.status(res.statusCode).json({
                message: "vote  was added",
                data:result,
              });
        }
    })
}
exports.getVotes=(req,res)=>{
    client.query(`SELECT  count(statut) AS NumberOfVotes,statut  FROM  vote_sondage  WHERE id_sondage='${req.body.idsondage}' GROUP BY statut ORDER BY statut`,(err,result)=>{
        if (err){
            res.status(res.statusCode).json({
                errorCode: err,
                status: res.statusCode,
              });
        }else{
            if(result.length==0){
                res.status(res.statusCode).json({
                    message: "votes",
                    NumberOfVotesFalse:0,
                    NumberOfVotesTrue:0
                  });
            }else if(result[0]==undefined || result[1]==undefined){
                if(result[0].statut==1){
                    res.status(res.statusCode).json({
                        message: "votes",
                        NumberOfVotesFalse:0,
                        NumberOfVotesTrue:result[0].NumberOfVotes
                      });
                }else{
                    res.status(res.statusCode).json({
                        message: "votes",
                        NumberOfVotesFalse:result[0].NumberOfVotes,
                        NumberOfVotesTrue:0
                      }); 
                }
            }
            else{
                res.status(res.statusCode).json({
                    message: "votes",
                    NumberOfVotesFalse:result[0]==undefined?0:result[0].NumberOfVotes??0,
                    NumberOfVotesTrue:result[1]==undefined?0:result[1].NumberOfVotes??0
                  });
            }

        }
    })
}

exports.getVote=(req,res)=>{
    client.query(`SELECT count (id_sondage)  FROM  vote_sondage WHERE statut='${req.body.statut}' `,(err,result)=>{
        if (err){
            res.status(res.statusCode).json({
                errorCode: err,
                status: res.statusCode,
              });
        }else{
            res.status(res.statusCode).json({
                message: "votes",
                data:result,
              });
        }
    })
}
exports.deletesondage=(req,res)=>{
    if (req.body.idsondage == undefined) {
        res.status(res.statusCode).json({
          message: "idsondage not found",
          error: true,
          status: res.statusCode,
        });
        return
      }
      
    client.query(`SELECT  * FROM sondage JOIN club ON sondage.id_club=club.id_club WHERE id_sondage='${req.body.idsondage}' AND sondage.id_membre='${req.verified.user_auth.id_membre}' OR id_sondage='${req.body.idsondage}' AND club.id_membre='${req.verified.user_auth.id_membre}'`,(err,result)=>{
        if (err){
            res.status(res.statusCode).json({
                errorCode: err,
                status: res.statusCode,
              });
        }else{
            if(result[0]==undefined){
                res.status(res.statusCode).json({
                    message: "sondage not found or you are not authorized  to deleted",
                  });
            }else{
                client.query(`DELETE vote_sondage FROM vote_sondage where id_sondage=${result[0].id_sondage}`,(err,resuldelCommen)=>{
                    if (err){
                        res.status(res.statusCode).json({
                            errorCode: err,
                            status: res.statusCode,
                          });
                    }else{
                        client.query(`DELETE sondage FROM sondage where id_sondage=${result[0].id_sondage}`,(err,resuldeletePost)=>{
                            if (err){
                                res.status(res.statusCode).json({
                                    errorCode: err.message,
                                    status: res.statusCode,
                                  });
                            }else{
                                res.status(res.statusCode).json({
                                    message: "sondage was deleted",
                                    status: res.statusCode,
                                  });
                            }
                        })
                    }
                })
            }
        }   
    })
}
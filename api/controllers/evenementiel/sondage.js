var client = require('../../../db_connection')
//id_membre
exports.getsondage=(req,res)=>{
    client.query(`SELECT user.nom,user.prenom,sondage.id_sondage,sondage.date_sondage,sondage.heure_sondage,sondage.titre,sondage.id_sondage FROM  sondage JOIN membre on sondage.id_membre=membre.id_membre JOIN user on membre.cin=user.cin  WHERE id_club='${req.body.idclub}'  `,(err,result)=>{
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
    const datee=date.getFullYear()+"-"+date.getMonth()+"-"+date.getDay();
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
    client.query(`SELECT *  FROM  vote_sondage WHERE id_sondage='${req.body.idsondage}' `,(err,result)=>{
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


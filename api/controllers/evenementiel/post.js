
var client = require('../../../db_connection')

exports.getposts=(req,res)=>{
    client.query(`SELECT user.nom,user.prenom,publication_club.description,publication_club.date,publication_club.heure,publication_club.url_image,publication_club.id_publication,membre.membreimage
    FROM  publication_club JOIN membre on publication_club.id_membre=membre.id_membre JOIN user on membre.cin=user.cin  WHERE id_club='${req.body.idclub}'  
    ORDER BY publication_club.date ASC  , publication_club.heure DESC
    ;`,(err,result)=>{
        if (err){
            res.status(res.statusCode).json({
                errorCode: err.message,
                status: res.statusCode,
              });
        }else{
            res.status(res.statusCode).json({
                message: "club posts",
                data:result,
              });
        }
    })
}
exports.addpost=(req,res)=>{
    var newurlString=""
    if(req.file!=undefined){
        for(let i = 0;i<req.file.path.length;i++){
            if(req.file.path[i]=='\\'){
              newurlString+="/"
            }else{
              newurlString+=req.file.path[i]
            }
          }
    }else{
        newurlString=undefined
    }
 console.log(client.escape(req.body.description))
    const date = new Date();
    const datee=date.getFullYear()+"-"+(date.getMonth()+1-0)+"-"+date.getDate();
    const heure=date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    client.query(`INSERT INTO publication_club
    (date,heure,id_membre,description,id_club,url_image) 
    VALUES ('${datee}','${heure}','${req.verified.user_auth.id_membre}',${client.escape(req.body.description)},${client.escape(req.body.idclub)},${client.escape(newurlString)});`,(err,result)=>{
        if (err){
            res.status(res.statusCode).json({
                errorCode: err,
                status: res.statusCode,
              });
        }else{
            res.status(res.statusCode).json({
                message: "post was added",
                data:result,
              });
        }
    })
}
exports.addComment=(req,res)=>{
    const date = new Date();
    const datee=date.getFullYear()+"-"+(date.getMonth()+1-0)+"-"+date.getDate();
    const heure=date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    client.query(`INSERT INTO commentaire_publication
    (date,heure,id_publication,description,id_membre) 
    VALUES ('${datee}','${heure}',${client.escape(req.body.id_publication)},${client.escape(req.body.description)},${client.escape(req.verified.user_auth.id_membre)}) ;`,(err,result)=>{
        if (err){
            res.status(res.statusCode).json({
                errorCode: err,
                status: res.statusCode,
              });
        }else{
            res.status(res.statusCode).json({
                message: "comment was was added",
                data:result,
              });
        }
    })
}
exports.getComments=(req,res)=>{
    client.query(`SELECT  
        user.nom,user.prenom,commentaire_publication.description,commentaire_publication.id_commentaire,commentaire_publication.heure,commentaire_publication.date,membre.membreimage
        FROM
        publication_club JOIN commentaire_publication on commentaire_publication.id_publication=publication_club.id_publication
        JOIN membre on membre.id_membre=commentaire_publication.id_membre JOIN user on membre.cin=user.cin
          WHERE publication_club.id_publication='${req.body.idpublication}' 
          ORDER BY commentaire_publication.date DESC , commentaire_publication.heure DESC
          ;`,(err,result)=>{
        if (err){
            res.status(res.statusCode).json({
                errorCode: err,
                status: res.statusCode,
              });
        }else{
            res.status(res.statusCode).json({
                message: "post comments",
                data:result,
              });
        }
    })
}
exports.deletePost=(req,res)=>{
    if (req.body.id_publication ===undefined) {
        res.status(res.statusCode).json({
          message: "id_publication not found",
          error: true,
          status: res.statusCode,
        });
        return
      }
      
    client.query(`SELECT  * FROM publication_club JOIN club ON publication_club.id_club=club.id_club WHERE id_publication='${req.body.id_publication}' AND publication_club.id_membre='${req.verified.user_auth.id_membre}' OR publication_club.id_publication=${client.escape(req.body.id_publication)} AND club.id_membre='${req.verified.user_auth.id_membre}';`,(err,result)=>{
        if (err){
            res.status(res.statusCode).json({
                errorCode: err,
                status: res.statusCode,
              });
        }else{
            if(result[0]==undefined){
                res.status(res.statusCode).json({
                    message: "post not found or you are not authorized  to deleted",
                  });
            }else{
                client.query(`DELETE commentaire_publication FROM commentaire_publication where id_publication=${result[0].id_publication}`,(err,resuldelCommen)=>{
                    if (err){
                        res.status(res.statusCode).json({
                            errorCode: err,
                            status: res.statusCode,
                          });
                    }else{
                        client.query(`DELETE publication_club FROM publication_club where id_publication=${result[0].id_publication}`,(err,resuldeletePost)=>{
                            if (err){
                                res.status(res.statusCode).json({
                                    errorCode: err.message,
                                    status: res.statusCode,
                                  });
                            }else{
                                res.status(res.statusCode).json({
                                    message: "post was deleted",
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
exports.deleteComment=(req,res)=>{
    if (req.body.id_commentaire ===undefined) {
        res.status(res.statusCode).json({
          message: "id_commentaire not found",
          error: true,
          status: res.statusCode,
        });
        return
      }
    client.query(`DELETE commentaire_publication FROM commentaire_publication  WHERE id_commentaire=${req.body.id_commentaire} AND id_membre=${req.verified.user_auth.id_membre}`,(err,result)=>{
        if (err){
                res.status(res.statusCode).json({
                errorCode: err.message,
                status: res.statusCode,
              });
        }else{
          if(result.affectedRows!=0){
            res.status(res.statusCode).json({
              message: "calandrier was deleted",
              data:result,
          });
          }else{
            res.status(res.statusCode).json({
              message: " calendrier data not found or you are not authorized  to deleted"
         
          });
          }
        }
      })
}
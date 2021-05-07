
var client = require('../../../db_connection')

exports.getposts=(req,res)=>{
    client.query(`SELECT user.nom,user.prenom,publication_club.description,publication_club.date,publication_club.heure,publication_club.url_image,publication_club.id_publication
    FROM  publication_club JOIN membre on publication_club.id_member=membre.id_membre JOIN user on membre.cin=user.cin  WHERE id_club='${req.body.idclub}'  `,(err,result)=>{
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
 
    const date = new Date();
    const datee=date.getFullYear()+"-"+date.getMonth()+"-"+date.getDay();
    const heure=date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    client.query(`INSERT INTO publication_club
    (date,heure,id_member,description,id_club,url_image) 
    VALUES ('${datee}','${heure}','${req.verified.user_auth.id_membre}','${req.body.description}','${req.body.idclub}','${newurlString}') `,(err,result)=>{
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
    const datee=date.getFullYear()+"-"+date.getMonth()+"-"+date.getDay();
    const heure=date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    client.query(`INSERT INTO commentaire_publication
    (date,heure,id_publication,description,id_membre) 
    VALUES ('${datee}','${heure}','${req.body.idpublication}','${req.body.description}','${req.verified.user_auth.id_membre}') `,(err,result)=>{
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
        user.nom,user.prenom,commentaire_publication.description,commentaire_publication.heure,commentaire_publication.date
        FROM
        publication_club JOIN commentaire_publication on commentaire_publication.id_publication=publication_club.id_publication
        JOIN membre on membre.id_membre=commentaire_publication.id_membre JOIN user on membre.cin=user.cin
          WHERE publication_club.id_publication='${req.body.idpublication}'  `,(err,result)=>{
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
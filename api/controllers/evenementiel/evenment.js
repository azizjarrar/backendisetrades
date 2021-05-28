var client = require('../../../db_connection')


//id_event	description	date_debut	date_fin	heure_debut	heure_fin	statut	url_image	url_event	id_membre	id_club
exports.getevents=(req,res)=>{
    client.query(`SELECT  event.url_image,club.nom_club,event.url_event,event.heure_fin,event.heure_debut,event.date_fin,event.date_debut,event.statut,event.description,club.id_club,event.id_event FROM event JOIN club on club.id_club=event.id_club`,(err,result)=>{
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
//id_event	description	date_debut	date_fin	heure_debut	heure_fin	statut	url_image	url_event	id_membre	id_club

exports.addevent=(req,res)=>{

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
    client.query(`SELECT * FROM membre JOIN club  ON club.id_membre=membre.id_membre WHERE club.id_membre=${req.verified.user_auth.id_membre} and  club.id_club=${req.body.id_club}`,(err,result)=>{

        if (err) {
            res.status(res.statusCode).json({
              errorCode: err.message,
              status: res.statusCode,
            });
            return
        }
        if (result.length == 0 || result[0] == undefined) {
            client.query(`INSERT INTO event(description,date_debut,date_fin,heure_debut,heure_fin,statut,url_image,url_event,id_membre,id_club)
            VALUES('${req.body.description}','${req.body.date_debut}','${req.body.date_fin}','${req.body.heure_debut}','${req.body.heure_fin}','${req.body.statut}','${newurlString}','${req.body.url_event}','${req.verified.user_auth.id_membre}','${req.body.id_club}')
            `,(err,result)=>{
                if (err) {
                    res.status(res.statusCode).json({
                      errorCode: err.message,
                      status: res.statusCode,
                    });
                }else{
                    res.status(res.statusCode).json({
                        message: "event was added",
                       
                      });
                }
            })
        }else{
            res.status(res.statusCode).json({
                message: "you are not allowd to add event ",
              });
        }
    })

}
exports.addComment=(req,res)=>{

}
exports.getComments=(req,res)=>{

}
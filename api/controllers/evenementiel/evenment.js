var client = require('../../../db_connection')


//id_event	description	date_debut	date_fin	heure_debut	heure_fin	statut	url_image	url_event	id_membre	id_club
exports.getevents=(req,res)=>{
    client.query(`SELECT event.titre_event, event.url_image,club.nom_club,event.url_event,event.heure_fin,event.heure_debut,event.date_fin,event.date_debut,event.statut,event.description,club.id_club,event.id_event FROM event JOIN club on club.id_club=event.id_club
    ORDER BY event.date_debut DESC , event.heure_debut DESC
    `,(err,result)=>{
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
    if(req.body.description==undefined){
        res.status(res.statusCode).json({
          message: "description not found",
          error:true,
          status: res.statusCode,
        });
        return
      }
      if(req.body.date_debut==undefined){
        res.status(res.statusCode).json({
          message: "date_debut not found",
          error:true,
          status: res.statusCode,
        });
        return
      }
      if(req.body.date_fin==undefined){
        res.status(res.statusCode).json({
          message: "date_fin not found",
          error:true,
          status: res.statusCode,
        });
        return
      }
      if(req.body.heure_debut==undefined){
        res.status(res.statusCode).json({
          message: "heure_debut not found",
          error:true,
          status: res.statusCode,
        });
        return
      }
      if(req.body.heure_fin==undefined){
        res.status(res.statusCode).json({
          message: "heure_fin not found",
          error:true,
          status: res.statusCode,
        });
        return
      }
      if(req.body.heure_fin==undefined){
        res.status(res.statusCode).json({
          message: "heure_fin not found",
          error:true,
          status: res.statusCode,
        });
        return
      }
      if(req.body.statut==undefined){
        res.status(res.statusCode).json({
          message: "statut not found",
          error:true,
          status: res.statusCode,
        });
        return
      }
      if(req.body.url_event==undefined){
        res.status(res.statusCode).json({
          message: "url_event not found",
          error:true,
          status: res.statusCode,
        });
        return
      }
      if(req.body.id_club==undefined){
        res.status(res.statusCode).json({
          message: "id_club not found",
          error:true,
          status: res.statusCode,
        });
        return
      }
      
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
    client.query(`SELECT * FROM membre JOIN club  ON club.id_membre=membre.id_membre WHERE club.id_membre=${req.verified.user_auth.id_membre} and  club.id_club=${client.escape(req.body.id_club)}`,(err,result)=>{

        if (err) {
            res.status(res.statusCode).json({
              errorCode: err.message,
              status: res.statusCode,
            });
            return
        }

        if (result.length != 0 || result[0] != undefined) {
          console.log(req.body.titre_event)
            client.query(`INSERT INTO event(titre_event,description,date_debut,date_fin,heure_debut,heure_fin,statut,url_image,url_event,id_membre,id_club)
            VALUES(${client.escape(req.body.titre_event)},${client.escape(req.body.description)},${client.escape(req.body.date_debut)},${client.escape(req.body.date_fin)},${client.escape(req.body.heure_debut)},${client.escape(req.body.heure_fin)},${client.escape(req.body.statut)},${client.escape(newurlString)},${client.escape(req.body.url_event)},${client.escape(req.verified.user_auth.id_membre)},${client.escape(req.body.id_club)})
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
                message: "you are not allowed to add event ",
              });
        }
    })

}
exports.getClubEvents=(req,res)=>{
    if(req.body.id_club==undefined){
        res.status(res.statusCode).json({
          message: "idclub not found",
          error:true,
          status: res.statusCode,
        });
        return
      }
    client.query(`SELECT  event.titre_event,event.url_image,club.nom_club,event.url_event,event.heure_fin,event.heure_debut,event.date_fin,event.date_debut,event.statut,event.description,club.id_club,event.id_event FROM event JOIN club on club.id_club=event.id_club WHERE club.id_club=${client.escape(req.body.id_club)} `,(err,result)=>{
        if (err){
            res.status(res.statusCode).json({
                errorCode: err.message,
                status: res.statusCode,
              });
        }else{
            res.status(res.statusCode).json({
                message: "club events",
                data:result,
              });
        }
    })
}


exports.deleteEvent=(req,res)=>{
  

  if (req.body.id_event == undefined) {
      res.status(res.statusCode).json({
        message: "id_event not found",
        error: true,
        status: res.statusCode,
      });
      return
    }
    client.query(`DELETE FROM participation  where id_event=${client.escape(req.body.id_event)}`,(err,result)=>{
      if (err) {
          res.status(res.statusCode).json({
            errorCode: err.message,
            status: res.statusCode,
          });
          return
      }else{
        client.query(`DELETE   event FROM event JOIN club ON event.id_club=club.id_club WHERE event.id_event=${client.escape(req.body.id_event)} AND event.id_membre=${req.verified.user_auth.id_membre} OR event.id_event=${client.escape(req.body.id_event)} AND club.id_membre=${req.verified.user_auth.id_membre}`,(err,result)=>{
          if (err){
              res.status(res.statusCode).json({
                  errorCode: err,
                  status: res.statusCode,
                });
          }else{
              res.status(res.statusCode).json({
                message: "event  was deleted",
                status: res.statusCode,
              });
          }
        })
      }
    })

}
exports.getOneEvent=(req,res)=>{
  
  if(req.body.id_event==undefined){
    res.status(res.statusCode).json({
      message: "id_event not found",
      error:true,
      status: res.statusCode,
    });
    return
  }
  client.query(`SELECT  *  from event join club on club.id_club=event.id_club where id_event=${client.escape(req.body.id_event)} `,(err,result)=>{
    if (err){
        res.status(res.statusCode).json({
            errorCode: err,
            status: res.statusCode,
          });
    }else{
        res.status(res.statusCode).json({
          message: "event",
          data: result,
        });
    }
  })
}
exports.updateEvent=(req,res)=>{
  if(req.body.id_event==undefined){
    res.status(res.statusCode).json({
      message: "id_event not found",
      error:true,
      status: res.statusCode,
    });
    return
  }
  client.query(`SELECT  club.id_membre as idAdminClub,event.id_membre as idOfCreatorOfEvent FROM event JOIN club on club.id_club=event.id_club where id_event=${client.escape(req.body.id_event)} LIMIT 1` ,(err,result)=>{
    if (err){ 
      res.status(res.statusCode).json({
          errorCode: err.message,
          status: res.statusCode,
        });
  }else{
    if(req.verified.user_auth.id_membre===result[0].idAdminClub || req.verified.user_auth.id_membre===result[0].idOfCreatorOfEvent){
      const titre_event =req.body.titre_event;
      const description=req.body.description;
      const date_debut=req.body.date_debut;
      const date_fin=req.body.date_fin;
      const heure_debut=req.body.heure_debut;
      const heure_fin=req.body.heure_fin;
      const statu=req.body.statu;
      const url_event=req.body.url_event;
      const url_image=req.body.url_image;
    
      let queryString=`${titre_event!=undefined?"titre_event="+"'"+titre_event+"'":''} ${description!=undefined?"description="+"'"+description+"'":''}  ${date_debut!=undefined?"date_debut="+"'"+date_debut+"'":''} ${date_fin!=undefined?"date_fin="+"'"+date_fin+"'":''} ${heure_debut!=undefined?"heure_debut="+"'"+heure_debut+"'":''} ${heure_fin!=undefined?"heure_fin="+"'"+heure_fin+"'":''} ${statu!=undefined?"statut="+"'"+statu+"'":''} ${url_event!=undefined?"url_event="+"'"+url_event+"'":''} ${url_image!=undefined?"url_image="+"'"+url_image+"'":''} `
    
      for(let i =0;i<queryString.length-1;i++){
        if(queryString[i]==" "&&queryString[i+1]!=" "&&queryString[0]!=" "){
          queryString=queryString.replace(" ",",")
        }
       }
    
    
      let query=`UPDATE event SET ${queryString} where id_event=${client.escape(req.body.id_event)}`;
      client.query(query ,(err,result)=>{
        if (err){ 
          res.status(res.statusCode).json({
              errorCode: err.message,
              status: res.statusCode,
            });
      }else{
          res.status(res.statusCode).json({
          message: "user data  was updated",
          data:result,
          });
      }
      })
    }else{
      res.status(res.statusCode).json({
        status: res.statusCode,
        message:"you are not authorized"
      });
    }
  }
})

}
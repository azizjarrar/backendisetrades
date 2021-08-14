var client = require('../../../db_connection')

exports.getclubs=(req,res)=>{
    client.query(`SELECT *  FROM  club `,(err,result)=>{
        if (err){
            res.status(res.statusCode).json({
                errorCode: err.message,
                status: res.statusCode,
              });
        }else{
            res.status(res.statusCode).json({
                message: "clubs",
                data:result,
              });
        }
    })

}

exports.getuserClubs=(req,res)=>{
        client.query(`SELECT club.id_club,club.nom_club,club.id_membre  AS idadminclub FROM  membre JOIN liste_membre on  liste_membre.cin_membre=membre.cin JOIN club on club.id_club=liste_membre.id_club WHERE membre.id_membre='${req.verified.user_auth.id_membre}'`,(err,result)=>{
        if (err){
            res.status(res.statusCode).json({
                errorCode: err.message,
                status: res.statusCode,
              });
        }else{
            res.status(res.statusCode).json({
                message: "clubs",
                data:result,
              });
        }
    })
}
/*not Used */
exports.getClubYouAreAdminIn=(req,res)=>{
    client.query(`SELECT club.id_club,club.nom_club  FROM  club join membre on membre.id_membre=club.id_membre where club.id_membre=${client.escape(req.verified.user_auth.id_membre)} `,(err,result)=>{
        if (err){
            res.status(res.statusCode).json({
                errorCode: err.message,
                status: res.statusCode,
              });
        }else{
            console.log(result)
            res.status(res.statusCode).json({
                message: "club you are admin in",
                data:result,
              });
        }
    })
}

exports.isAdmin=(req,res)=>{
    if (req.body.id_club == undefined) {
        res.status(res.statusCode).json({
          message: "id_club not found",
          error: true,
          status: res.statusCode,
        });
        return
      }
    client.query(`SELECT *  FROM  club join membre on membre.id_membre=club.id_membre where club.id_membre=${client.escape(req.verified.user_auth.id_membre)} && club.id_club=${client.escape(req.body.id_club)} `,(err,result)=>{
        if (err){
            res.status(res.statusCode).json({
                errorCode: err.message,
                status: res.statusCode,
              });
        }else{
            if(result.length==1){
                res.status(res.statusCode).json({
                    message: "club you are admin in",
                    isAdmin:true,
                  });
            }else{
                res.status(res.statusCode).json({
                    message: "club you are admin in",
                    isAdmin:false,
                  });
            }
      
        }
    })
}
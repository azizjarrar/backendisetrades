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
        client.query(`SELECT club.id_club,club.nom_club  FROM  membre JOIN liste_membre on  liste_membre.cin_membre=membre.cin JOIN club on club.id_club=liste_membre.id_club WHERE membre.id_membre='${req.verified.user_auth.id_membre}'`,(err,result)=>{
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
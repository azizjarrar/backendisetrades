var client = require('../../../db_connection')


exports.getOneUser=(req,res)=>{
    if(req.body.idmembre==undefined){
        res.status(res.statusCode).json({
          message: "idmembre not found",
          error:true,
          status: res.statusCode,
        });
        return
      }
    client.query(`SELECT *  FROM  membre WHERE id_membre='${req.body.idmembre}'`,(err,result)=>{
        if (err){
            res.status(res.statusCode).json({
                errorCode: err.message,
                status: res.statusCode,
              });
        }else{
            if(result.length==0 || result[0]==undefined){
                res.status(res.statusCode).json({
                  errorCode: "user not found",
                  status: res.statusCode,
              }); 
            }else{
                res.status(res.statusCode).json({
                    message: "user data",
                    data:result,
                  });
            }
   
        }
    })
}
exports.getClubUsers=(req,res)=>{
    if(req.body.idclub==undefined){
        res.status(res.statusCode).json({
          message: "idclub not found",
          error:true,
          status: res.statusCode,
        });
        return
      }
    client.query(`SELECT membre.nom, membre.prenom ,membre.id_membre, membre.n_tel  ,membre.email  FROM  club JOIN liste_membre on club.id_club=liste_membre.id_club  JOIN membre on membre.cin=liste_membre.cin_membre where club.id_club='${req.body.idclub}'` ,(err,result)=>{
        if (err){
            res.status(res.statusCode).json({
                errorCode: err.message,
                status: res.statusCode,
              });
        }else{
            res.status(res.statusCode).json({
            message: "user data",
            data:result,
            });
        }
    })
}
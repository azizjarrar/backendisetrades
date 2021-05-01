var client = require('../../../db_connection')


exports.getOneUser=(req,res)=>{
    if(req.body.idmember==undefined){
        res.status(res.statusCode).json({
          message: "idmember not found",
          error:true,
          status: res.statusCode,
        });
        return
      }
    client.query(`SELECT *  FROM  member WHERE id_membre='${req.body.idmember}'`,(err,result)=>{
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
    client.query(`SELECT member.nom, member.pernom ,member.id_membre, member.n_tel  ,member.email  FROM  club JOIN list_member on club.id_club=list_member.id_club  JOIN member on member.cin=list_member.cin_member where club.id_club='${req.body.idclub}'` ,(err,result)=>{
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
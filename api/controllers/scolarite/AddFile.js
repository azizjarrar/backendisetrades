var client = require('../../../db_connection')
exports.add=(req,res)=>{
 
  client.query(` INSERT INTO papier_administratif (date, type_papier,id_etudiant) VALUES ('${req.body.date}','${req.body.type_papier}','${req.body.id_etudiant}')`, function (err, result) {
      if (err){
          res.status(res.statusCode).json({
              errorCode: err.message,
              status: res.statusCode,
              
            });
      }else{
          res.status(res.statusCode).json({
              message: "done",
              data:result,
              status: res.statusCode,
            });
      }
    });

}
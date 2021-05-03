
var client = require('../../../db_connection')
exports.addReclamation=(req,res)=>{
 
  client.query(` INSERT INTO reclamation (id_reclamation,type_reclamation,
     contenu,statut 
     ,date_reclamation,id_etudiant  ) 
     VALUES ('${req.body.id_reclamation}'
  ,'${req.body.type_reclamation}','${req.body.contenu}'
  ,'${req.body.statut}','${req.body.date_reclamation}',
  '${req.body.id_etudiant}')`, function (err, result) {
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
exports.updateReclamation=(req,res)=>{
  
  client.query( 'UPDATE reclamation SET type_reclamation=?,statut=?,contenu=? where id_reclamation=? ',
              [req.body.type_reclamation,req.body.statut,req.body.contenu,req.params.id] , function (err, result) {
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

exports.deleteReclamation=(req,res)=>{
  
  client.query( 'DELETE from reclamation where id_reclamation=? ',
              [req.params.id] , function (err, result) {
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
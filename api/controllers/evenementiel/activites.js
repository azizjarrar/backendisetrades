var client = require('../../../db_connection')

exports.addactivite=(req,res)=>{
    if (req.body.titre_act == undefined) {
        res.status(res.statusCode).json({
          message: "titre_act not found",
          error: true,
          status: res.statusCode,
        });
        return
      }
      if (req.body.description_act == undefined) {
        res.status(res.statusCode).json({
          message: "description_act not found",
          error: true,
          status: res.statusCode,
        });
        return
      }
      if (req.body.idclub == undefined) {
        res.status(res.statusCode).json({
          message: "idclub not found",
          error: true,
          status: res.statusCode,
        });
        return
      }

    client.query(`INSERT INTO activites(titre_act,description_act,idclub) VALUES(${client.escape(req.body.titre_act)},${client.escape(req.body.description_act)},${client.escape(req.body.idclub)})`,(err,result)=>{
        if (err){
            res.status(res.statusCode).json({
                errorCode: err.message,
                status: res.statusCode,
              });
        }else{
            res.status(res.statusCode).json({
                message: "activite was added",
              });
        }
    })
}
exports.getactivites=(req,res)=>{
    if (req.body.idclub == undefined) {
        res.status(res.statusCode).json({
          message: "idclub not found",
          error: true,
          status: res.statusCode,
        });
        return
      }

    client.query(`SELECT * FROM   activites where idclub=${client.escape(req.body.idclub)}`,(err,result)=>{
        if (err){
            res.status(res.statusCode).json({
                errorCode: err.message,
                status: res.statusCode,
              });
        }else{
            res.status(res.statusCode).json({
                message: "activites ",
                data:result
              });
        }
    })
}
exports.deleteactivite=(req,res)=>{
    if (req.body.idclub == undefined) {
        res.status(res.statusCode).json({
          message: "idclub not found",
          error: true,
          status: res.statusCode,
        });
        return
      }
      if (req.body.id_activites == undefined) {
        res.status(res.statusCode).json({
          message: "id_activites not found",
          error: true,
          status: res.statusCode,
        });
        return
      }
    client.query(`DELETE  FROM   activites where idclub=${client.escape(req.body.idclub)} AND id_activites=${client.escape(req.body.id_activites)}`,(err,result)=>{
        if (err){
            res.status(res.statusCode).json({
                errorCode: err.message,
                status: res.statusCode,
              });
        }else{
            res.status(res.statusCode).json({
                message: "activites ",
                data:result
              });
        }
    })
}
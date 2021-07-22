
var client = require('../../../db_connection')

exports.addcalender=(req,res)=>{
    if (req.body.id_club == undefined) {
        res.status(res.statusCode).json({
          message: "id_club not found",
          error: true,
          status: res.statusCode,
        });
        return
      }
      if (req.body.temps == undefined) {
        res.status(res.statusCode).json({
          message: "temps not found",
          error: true,
          status: res.statusCode,
        });
        return
      }
      if (req.body.date == undefined) {
        res.status(res.statusCode).json({
          message: "date not found",
          error: true,
          status: res.statusCode,
        });
        return
      }
      if (req.body.description == undefined) {
        res.status(res.statusCode).json({
          message: "description not found",
          error: true,
          status: res.statusCode,
        });
        return
      }
    client.query(`INSERT INTO calendrier(description,date,temps,id_club) VALUES('${req.body.description}','${req.body.date}','${req.body.temps}','${req.body.id_club}')`,(err,result)=>{
        if (err){
            res.status(res.statusCode).json({
                errorCode: err.message,
                status: res.statusCode,
              });
        }else{
            res.status(res.statusCode).json({
                message: "calander was added",
              });
        }
    })

}
exports.getcalender=(req,res)=>{
    if (req.body.id_club == undefined) {
        res.status(res.statusCode).json({
          message: "id_club not found",
          error: true,
          status: res.statusCode,
        });
        return
      }
    client.query(`SELECT *  FROM calendrier where id_club=${client.escape(req.body.id_club)} ORDER BY calendrier.date DESC , calendrier.temps DESC`,(err,result)=>{
        if (err){
    res.status(res.statusCode).json({
        errorCode: err.message,
        status: res.statusCode,
      });
}else{
    res.status(res.statusCode).json({
        message: "equipes",
        data:result,
    });
}
})
}
exports.deletecalender=(req,res)=>{
  if (req.body.id_calendrier == undefined) {
    res.status(res.statusCode).json({
      message: "id_calendrier not found",
      error: true,
      status: res.statusCode,
    });
    return
  }
  

  client.query(`DELETE calendrier FROM calendrier JOIN club ON calendrier.id_club=club.id_club WHERE id_calendrier='${req.body.id_calendrier}' AND club.id_membre='${req.verified.user_auth.id_membre}'`,(err,result)=>{
    if (err){
            res.status(res.statusCode).json({
            errorCode: err.message,
            status: res.statusCode,
          });
    }else{
      if(result.affectedRows!=0){
        res.status(res.statusCode).json({
          message: "calander was deleted",
          data:result,
      });
      }else{
        res.status(res.statusCode).json({
          message: " calendrier data not found or you are not authorized  to deleted"
     
      });
      }
    }
  })
}
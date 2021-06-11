
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
    client.query(`SELECT *  FROM calendrier where id_club='${req.body.id_club}'`,(err,result)=>{
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
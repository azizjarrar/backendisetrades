var client = require('../../../db_connection')

exports.getroles=(req,res)=>{
    client.query(`SELECT *  FROM  roles `,(err,result)=>{
        if (err){
            res.status(res.statusCode).json({
                errorCode: err.message,
                status: res.statusCode,
              });
        }else{
            res.status(res.statusCode).json({
                message: "roles",
                data:result,
              });
        }
    })
}
exports.getTeams=(req,res)=>{
    client.query(`SELECT *  FROM equipes `,(err,result)=>{
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
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
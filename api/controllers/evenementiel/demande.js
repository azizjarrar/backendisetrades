var client = require('../../../db_connection')
const jwt = require("jsonwebtoken");

exports.sendRequest=(req,res)=>{
 
    client.query(`INSERT INTO demande (role, equipe, nom_membre, nom_club) VALUES ('${req.body.role}','${req.body.equipe}','${req.body.nom_membre}','${req.body.nom_club}')`, function (err, result) {
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
  
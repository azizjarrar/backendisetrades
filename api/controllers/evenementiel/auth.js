var client = require('../../../db_connection')

exports.singin=(req,res)=>{
    client.query("SELECT * FROM salle ", function (err, result) {
        if (err) throw err;
        console.log(result);
        res.status(res.statusCode).json({
            message: "done",
            data:result,
            status: res.statusCode,
          });
      });

}
exports.singup=(req,res)=>{
    
}

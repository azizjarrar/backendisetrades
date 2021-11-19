const client = require('../../../db_connection');
module.exports.sql_request=(sql,values,res)=>{
    client.query(sql,values,(err,rows)=>{
        if(!err){
            if(rows.length>0||rows.affectedRows>0)
                res.status(200).json({
                    err:false,
                    rows:rows,
                })
            else
                {res.status(404).json({
                    err:false,
                    rows:null,
                    message:"good request but cannot match with sql"
                })   }     
        }
    
        else
       { res.status(500).json({
            err:true,
            message:err.sqlMessage,
        });}
    })

}

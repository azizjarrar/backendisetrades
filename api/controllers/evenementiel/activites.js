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
      if (req.body.date_act == undefined) {
        res.status(res.statusCode).json({
          message: "date_act not found",
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


    client.query(`INSERT INTO activites(titre_act,description_act,date_act,idclub)  VALUES(${client.escape(req.body.titre_act)},${client.escape(req.body.description_act)},${client.escape(req.body.date_act)},${client.escape(req.body.idclub)})`,(err,result)=>{
        if (err){
            res.status(res.statusCode).json({
                errorCode: err.message,
                status: res.statusCode,
              });
        }else{
          if(req.files.length>0){
          for(let j =0;j<req.files.length;j++){
            

            let url=""
            for(let i = 0;i<req.files[j].path.length;i++){
              if(req.files[j].path[i]=='\\'){
                url+="/"
              }else{
                url+=req.files[j].path[i]
              }
            }
            client.query(`INSERT INTO media_activites(id_activites,imageUrl) VALUES(${client.escape(result.insertId)},${client.escape(url)})`,(err,result)=>{})
           }
          }
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

    client.query(`SELECT *,activites.id_activites FROM   activites  LEFT JOIN   media_activites   on activites.id_activites=media_activites.id_activites    where idclub=${client.escape(req.body.idclub)} `,(err,result)=>{
        if (err){
            res.status(res.statusCode).json({
                errorCode: err.message,
                status: res.statusCode,
              });
        }else{
          let nestedData={}
          result.forEach((element,index) => {
            if(nestedData[element.id_activites]===null || nestedData[element.id_activites]===undefined){
              
              nestedData[element.id_activites]=element
              nestedData[element.id_activites].imageUrl=[nestedData[element.id_activites].imageUrl!=null?nestedData[element.id_activites].imageUrl:""]
            }else{
              nestedData[element.id_activites].imageUrl=[...nestedData[element.id_activites].imageUrl,element.imageUrl]
            }
          });
          
             res.status(res.statusCode).json({
                message: "activites ",
                data:nestedData
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
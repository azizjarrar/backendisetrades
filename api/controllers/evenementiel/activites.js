var client = require('../../../db_connection')
const validator = require('../../middleware/validator')
/**************************************************************************/
/**************this part is responsible of all activities API**************/
/**************************************************************************/
exports.addactivite=(req,res)=>{
     if(validator(req.body,["idclub","date_act","description_act","titre_act"],res)){
        return
      }
      //check if user is allowed to add activitie
    client.query(`select * FROM  liste_membre where id_club=${client.escape(req.body.idclub)} AND cin_membre=${client.escape(req.verified.user_auth.cin)};`,(err,result)=>{
      if (err){
          res.status(res.statusCode).json({
              errorCode: err.message,
              status: res.statusCode,
            });
      }else{
        if(result.length==0){
          res.status(res.statusCode).json({
            error:true,
            message: "you are not authorized",
            status: res.statusCode,
          });
          return
        }
        client.query(`INSERT INTO activites(titre_act,description_act,date_act,idclub)  VALUES(${client.escape(req.body.titre_act)},${client.escape(req.body.description_act)},${client.escape(req.body.date_act)},${client.escape(req.body.idclub)});`,(err,result)=>{
          if (err){
              res.status(res.statusCode).json({
                  errorCode: err.message,
                  status: res.statusCode,
                });
          }else{
                // reverse in image url '\'  to '/'
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
              client.query(`INSERT INTO media_activites(id_activites,imageUrl) VALUES(${client.escape(result.insertId)},${client.escape(url)});`)
             }
            }
              res.status(res.statusCode).json({
                  message: "activite was added",
            });
          }
      })
      }
    })
      

}
exports.getactivites=(req,res)=>{
      if(validator(req.body,["idclub"],res)){
        return
      }
    client.query(`SELECT *,activites.id_activites FROM   activites  LEFT JOIN   media_activites   on activites.id_activites=media_activites.id_activites    where idclub=${client.escape(req.body.idclub)};`,(err,result)=>{
        if (err){
            res.status(res.statusCode).json({
                errorCode: err.message,
                status: res.statusCode,
              });
        }else{
          let nestedData={}
          // reforme data to be more easy to use in front end regroup all images in array
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
    if(validator(req.body,["id_activites","idclub"],res)){
        return
      }
    client.query(`DELETE  FROM   activites where idclub=${client.escape(req.body.idclub)} AND id_activites=${client.escape(req.body.id_activites)};`,(err,result)=>{
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
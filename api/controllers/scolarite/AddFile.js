/////////////// require connection to server we need 
var client = require('../../../db_connection')
////////////we going to create a function that will be insert the data  this methode will insert the data from json  object 
///////////this function will be exported 
exports.addReclamation=(req,res)=>{
  /////////// this the database query to add the data
 ////////// req equale for parameter from the body or the url parameter 
 //////////res mean the result from the query  
  client.query(
    ` INSERT INTO reclamation (id_type_reclamation, id_statut_reclamation ,date_reclamation ,id_user ,oldSpeciality ,newSpeciality ,oldClass ,newClass ,oldSection ,newSection ,class_note ,sem_note ,mat_note ,class_exam ,sem_exam ,mat_exam ,class_inscr ,sem_inscr ,mat_inscr ) 
      VALUES ('${req.body.id_type_reclamation}','${req.body.id_statut_reclamation}','${req.body.date_reclamation}','${req.body.id_user}','${req.body.oldSpeciality}','${req.body.newSpeciality}','${req.body.oldClass}','${req.body.newClass}','${req.body.oldSection}','${req.body.newSection}','${req.body.class_note}','${req.body.sem_note}','${req.body.mat_note}','${req.body.class_exam}','${req.body.sem_exam}','${req.body.mat_exam}','${req.body.class_inscr}','${req.body.sem_inscr}','${req.body.mat_inscr}')`,
    function (err, result) {
          /////// if we get error we will get it from query   

      if (err) {
        //// this methode in nodeJs role is to get the result and add her parameter is the errore message
      ///// statusCode can be any error you did so node js get the code and 
        res.status(res.statusCode).json({
          errorCode: err.message,
          status: res.statusCode,
        });
      } else {
        //// part is when you get statu 200 that mean the query is excuted 

        res.json(result);
        res.status(res.statusCode);
      }
    }
  );

}
////////////we going to create a function that will be Update the data  change the status if the file demande 
exports.update=(req,res)=>{
/////////// this is the same code of the query parameter 
////////// here we used the params here we wont to get the data from url 
  client.query( 'UPDATE papier_administratif SET id_statut_papier=1 where id_papier=? ',
              [req.params.id] , function (err, result) {
                if (err){
                  res.json({
                    status:400,
                    message:err
                  })
                }else{
                  res.json({
                    status:200,
                    message:result
                  })
                }
    });
}
////////////we going to create a function that will be Update the data  change the status if the file demande 

exports.update2=(req,res)=>{
  
  client.query( 'UPDATE papier_administratif SET id_statut_papier=2 where id_papier=? ',
              [req.params.id] , function (err, result) {
            if (err){
              res.json({
                status:400,
                message:err
              })
            }else{
              res.json({
                status:200,
                message:result
              })
            }
    });

}
////////////we going to create a function that will be delete the data  change the status if the file demande 

exports.delete=(req,res)=>{
  
  client.query( 'DELETE from papier_administratif where id_papier=? ',
              [req.params.id] , function (err, result) {
                // console.log(err,result)
            if (err){
                res.status(404).json({
                    deleted:false   ,           
                    errorCode: err.message,
                    err:err
                  });
            }else{
                res.status(200).json({
                  deleted:true,
                  result
                })
            }
    });

}
//////////this will get the all the file 
//   au cas de tous les utilisateur ont des id papier =1 ex client.query( 'select email ,nom,prenom , cin ,id_papier,id_type_papier,date from  papier_administratif, user where id_papier=? ',

exports.getById=(req,res)=>{
    client.query( 'select  id_papier,id_type_papier,date,email ,nom,prenom , cin from  user,papier_administratif where user.id_user=papier_administratif.id_user and raison IS NULL',
    function (err, result) {
      if (err){
          res.status(res.statusCode).json({
              errorCode: err.message,
              status: res.statusCode,
              
            });
      }else{
        res.json(result);
          res.status(res.statusCode)
      }
    });

}
//////////////////////////////////Selection les papiers simple //////////////////////
exports.getPapierNonRaison=(req,res)=>{
  client.query( 'select  id_papier,id_type_papier,date,email ,nom,prenom , cin from  user,papier_administratif where user.id_user=papier_administratif.id_user and raison IS NOT NULL  ', function (err, result) {
    if (err){
        res.status(res.statusCode).json({
            errorCode: err.message,
            status: res.statusCode,
            
          });
    }else{
      res.json(result);
        res.status(res.statusCode)
    }
  });
}
//////////////////////////////////GetAll //////////////////////
exports.getAll=(req,res)=>{
  client.query( 'SELECT * FROM papier_administratif pa ,user u, etudiant e ,presence_etudiant pe ,enseignement eng ,classe cls,type_papier tp, statut_papier sp where u.id_user=pa.id_user and u.id_user=e.id_user and e.id_etudiant=pe.id_etudiant and pe.id_enseignement=eng.id_enseignement and eng.id_classe=cls.id_classe and pa.id_type_papier = tp.id_type_papier and pa.id_statut_papier = sp.id_statut_papier ORDER BY id_papier DESC'
  , function (err, result) {
    if (err){
        res.status(res.statusCode).json({
            errorCode: err.message,
            status: res.statusCode,
            
          });
    }else{
      res.json(result);
        res.status(res.statusCode)
    }
  });

}
//////////////////////////////////GetByUserID //////////////////////
exports.getByIdUser=(req,res)=>{
  client.query( 'select  id_papier,id_type_papier,date from papier_administratif where id_user=?',
            [req.params.id] , function (err, result) {
    if (err){
        res.status(res.statusCode).json({
            errorCode: err.message,
            status: res.statusCode,
            
          });
    }else{
      res.json(result);
        res.status(res.statusCode)
    }
  });

}
//////////////////////////////////getbyStatutAccepter //////////////////////
exports.getbyStatutAccepter=(req,res)=>{
  client.query( 'select  id_papier,libelle_type_papier,date from papier_administratif pa,type_papier tp where pa.id_type_papier = tp.id_type_papier and id_statut_papier=1 ORDER BY id_papier DESC'
           , function (err, result) {
    if (err){
        res.status(res.statusCode).json({
            errorCode: err.message,
            status: res.statusCode,
            
          });
    }else{
      res.json(result);
        res.status(res.statusCode)
    }
  });

}

//////////////////////////////////getbyStatutEnAttente //////////////////////
exports.getbyStatutEnAttente=(req,res)=>{
  client.query( 'select  id_papier,libelle_type_papier,date from papier_administratif pa,type_papier tp where pa.id_type_papier = tp.id_type_papier and id_statut_papier=3 ORDER BY id_papier DESC'
           , function (err, result) {
    if (err){
        res.status(res.statusCode).json({
            errorCode: err.message,
            status: res.statusCode,
          });
    }else{
      res.json(result);
        res.status(res.statusCode)
    }
  });

}
//////////////////////////////////getbyStatutRefuser //////////////////////
exports.getbyStatutRefuser=(req,res)=>{
  client.query( 'select  id_papier,libelle_type_papier,date from papier_administratif pa,type_papier tp where pa.id_type_papier = tp.id_type_papier and id_statut_papier=2 ORDER BY id_papier DESC'
           , function (err, result) {
    if (err){
        res.status(res.statusCode).json({
            errorCode: err.message,
            status: res.statusCode,
            
          });
    }else{
      res.json(result);
        res.status(res.statusCode)
    }
  });

}
//////////////////////////////////Get All Paper Types //////////////////////
exports.getAllPaperTypes=(req,res)=>{
  client.query( 'select  * from type_papier '
           , function (err, result) {
    if (err){
        res.status(res.statusCode).json({
            errorCode: err.message,
            status: res.statusCode,
            
          });
    }else{
      res.json(result);
        res.status(res.statusCode)
    }
  });

}
///////////////////////////////////////GetNumber//////////////////////////////
//////////////////////////////////GetAll //////////////////////
/////
exports.getAllNumber=(req,res)=>{
  client.query( 'SELECT count(*) FROM papier_administratif pa ,user u, etudiant e ,presence_etudiant pe ,enseignement eng ,classe cls,type_papier tp, statut_papier sp where u.id_user=pa.id_user and u.id_user=e.id_user and e.id_etudiant=pe.id_etudiant and pe.id_enseignement=eng.id_enseignement and eng.id_classe=cls.id_classe and pa.id_type_papier = tp.id_type_papier and pa.id_statut_papier = sp.id_statut_papier ORDER BY id_papier DESC'
  , function (err, result) {
    if (err){
        res.status(res.statusCode).json({
            errorCode: err.message,
            status: res.statusCode,
            
          });
    }else{
      res.json(result);
        res.status(res.statusCode)
    }
  });

}

//////////////////////////////////getbyStatutAccepter //////////////////////
exports.getAllNumberA=(req,res)=>{
  client.query( 'select  count(*) from papier_administratif pa,type_papier tp where pa.id_type_papier = tp.id_type_papier and id_statut_papier=1 ORDER BY id_papier DESC'
           , function (err, result) {
    if (err){
        res.status(res.statusCode).json({
            errorCode: err.message,
            status: res.statusCode,
            
          });
    }else{
      res.json(result);
        res.status(res.statusCode)
    }
  });

}

//////////////////////////////////getbyStatutEnAttente //////////////////////
exports.getAllNumberE=(req,res)=>{
  client.query( 'select  count(*) from papier_administratif pa,type_papier tp where pa.id_type_papier = tp.id_type_papier and id_statut_papier=3 ORDER BY id_papier DESC'
           , function (err, result) {
    if (err){
        res.status(res.statusCode).json({
            errorCode: err.message,
            status: res.statusCode,
          });
    }else{
      res.json(result);
        res.status(res.statusCode)
    }
  });

}
//////////////////////////////////getbyStatutRefuser //////////////////////
exports.getAllNumberR=(req,res)=>{
  client.query( 'select  count(*) from papier_administratif pa,type_papier tp where pa.id_type_papier = tp.id_type_papier and id_statut_papier=2 ORDER BY id_papier DESC'
           , function (err, result) {
    if (err){
        res.status(res.statusCode).json({
            errorCode: err.message,
            status: res.statusCode,
          });
    }else{
      res.json(result);
        res.status(res.statusCode)
    }
  });
}
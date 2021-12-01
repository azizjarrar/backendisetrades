/////////////// require connection to server we need 
var client = require('../../../db_connection')

////////////we going to create a function that will be insert the data  this methode will insert the data from json  object 
///////////this function will be exported 
exports.add=(req,res)=>{
  client.query(`INSERT INTO papier_administratif (date,raison, id_type_papier,id_user,id_statut_papier) VALUES ('${req.body.date}','${req.body.raison}','${req.body.id_type_papier}','${req.body.id_user}','${req.body.id_statut_papier}')`,
   function (err, result) {
      if (err){
          res.status(res.statusCode).json({
              errorCode: err.message,
              status: res.statusCode,
            });
      }else{
        res.status(200).json({
          added:true,
          result
        })
      }


});
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


exports.getByIdPapier=(req,res)=>{
  client.query( 'select * FROM papier_administratif pa ,user u, etudiant e ,presence_etudiant pe ,enseignement eng ,classe cls, statut_papier sp, type_papier tp  where pa.id_user =u.id_user  and u.id_user=e.id_user and e.id_etudiant=pe.id_etudiant and pe.id_enseignement=eng.id_enseignement and eng.id_classe=cls.id_classe and pa.id_statut_papier=sp.id_statut_papier and pa.id_type_papier=tp.id_type_papier and id_papier=?',
  [req.params.id],
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
  client.query( 'SELECT count(*) as nb FROM papier_administratif pa ,user u, etudiant e ,presence_etudiant pe ,enseignement eng ,classe cls,type_papier tp, statut_papier sp where u.id_user=pa.id_user and u.id_user=e.id_user and e.id_etudiant=pe.id_etudiant and pe.id_enseignement=eng.id_enseignement and eng.id_classe=cls.id_classe and pa.id_type_papier = tp.id_type_papier and pa.id_statut_papier = sp.id_statut_papier ORDER BY id_papier DESC'
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
  client.query( 'select  count(*) as nb from papier_administratif pa,type_papier tp where pa.id_type_papier = tp.id_type_papier and id_statut_papier=1 ORDER BY id_papier DESC'
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
  client.query( 'select  count(*) as nb from papier_administratif pa,type_papier tp where pa.id_type_papier = tp.id_type_papier and id_statut_papier=3 ORDER BY id_papier DESC'
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
  client.query( 'select  count(*) as nb from papier_administratif pa,type_papier tp where pa.id_type_papier = tp.id_type_papier and id_statut_papier=2 ORDER BY id_papier DESC'
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

exports.getDocNbByMonth=(req,res)=>{
  client.query( 'SELECT MONTH(date) AS month, count(id_papier) AS nb_reclam FROM papier_administratif GROUP BY MONTH(date);'
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


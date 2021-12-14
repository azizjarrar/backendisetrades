
var client = require('../../../db_connection')
////////////we going to create a function that will be insert the data  this methode will insert the data from json  object 
///////////this function will be exported
exports.addReclamation=(req,res)=>{
  /////////// this the database query to add the data
 ////////// req equale for parameter from the body or the url parameter 
 //////////res mean the result from the query  
 client.query(
  `INSERT INTO reclamation (id_type_reclamation, id_statut_reclamation ,date_reclamation ,id_user ,oldSpeciality ,newSpeciality ,oldClass ,newClass ,oldSection ,newSection ,class_note ,sem_note ,mat_note ,class_exam ,sem_exam ,mat_exam ,class_inscr ,sem_inscr ,mat_inscr ) VALUES ('${req.body.id_type_reclamation}','${req.body.id_statut_reclamation}','${req.body.date_reclamation}','${req.body.id_user}','${req.body.oldSpeciality}','${req.body.newSpeciality}','${req.body.oldClass}','${req.body.newClass}','${req.body.oldSection}','${req.body.newSection}','${req.body.class_note}','${req.body.sem_note}','${req.body.mat_note}','${req.body.class_exam}','${req.body.sem_exam}','${req.body.mat_exam}','${req.body.class_inscr}','${req.body.sem_inscr}','${req.body.mat_inscr}')`,
    function (err, result) {
   if (err){
       res.status(res.statusCode).json({
           errorCode: err.message,
           status: res.statusCode,

         });
   }else{
     res.json(result);
     res.status(res.statusCode)      }
 });

}

// exports.updateReclamation=(req,res)=>{
  
//   client.query( 'UPDATE reclamation SET type_reclamation=?,statut=?,contenu=? where id_reclamation=? ',
//               [req.body.type_reclamation,req.body.statut,req.body.contenu,req.params.id] , function (err, result) {
//       if (err){
//           res.status(res.statusCode).json({
//               errorCode: err.message,
//               status: res.statusCode,
              
//             });
//       }else{
//           res.status(res.statusCode)
//       }
//     });

// }

exports.deleteReclamation=(req,res)=>{
  
  client.query( 'DELETE from reclamation where id_reclamation=? ',
              [req.params.id] , function (err, result) {
      if (err){
          res.status(res.statusCode).json({
              errorCode: err.message,
              status: res.statusCode,
              
            });
      }else{
        res.json(result);
        res.status(res.statusCode)      }
    });
}


////////////////////// getAllReclamation ////////////////////////////////////////////////

exports.getAllReclamation=(req,res)=>{
  client.query( 'SELECT DISTINCT * FROM reclamation rec ,user u, etudiant e ,presence_etudiant pe ,enseignement eng ,classe cls ,type_reclamation tr, statut_reclamation sr  where rec.id_user =u.id_user  and u.id_user=e.id_user and e.id_etudiant=pe.id_etudiant and pe.id_enseignement=eng.id_enseignement and eng.id_classe=cls.id_classe and rec.id_type_reclamation=tr.id_type_reclamation and rec.id_statut_reclamation=sr.id_statut_reclamation ORDER BY id_reclamation DESC',
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

////////////////////// getByStatut ////////////////////////////////////////////////

exports.getReclamationByIdStatut=(req,res)=>{
  client.query( 'select  id_reclamation,type_reclamation,date_reclamation,contenue ,id_user from reclamation , user where user.id_user=reclamation.id_user ORDER BY id_reclamation DESC',
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

//////////////////////////////////GetByUserID //////////////////////
exports.getReclamationByIdUser=(req,res)=>{
  client.query( 'select * from reclamation rec, user, type_reclamation tr where rec.id_type_reclamation=tr.id_type_reclamation and user.id_user=rec.id_user',
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
  client.query( 'SELECT *  FROM reclamation rec ,user u, etudiant e ,presence_etudiant pe ,enseignement eng ,classe cls , statut_reclamation sr where rec.id_user =u.id_user  and u.id_user=e.id_user and e.id_etudiant=pe.id_etudiant and pe.id_enseignement=eng.id_enseignement and eng.id_classe=cls.id_classe and rec.id_statut_reclamation=sr.id_statut_reclamation and rec.id_statut_reclamation=1 ORDER BY id_reclamation DESC'
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
  client.query( 'SELECT *  FROM reclamation rec ,user u, etudiant e ,presence_etudiant pe ,enseignement eng ,classe cls, statut_reclamation sr  where rec.id_user =u.id_user  and u.id_user=e.id_user and e.id_etudiant=pe.id_etudiant and pe.id_enseignement=eng.id_enseignement and eng.id_classe=cls.id_classe and rec.id_statut_reclamation=sr.id_statut_reclamation and rec.id_statut_reclamation=2 ORDER BY id_reclamation DESC'
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
  client.query( 'SELECT *  FROM reclamation rec ,user u, etudiant e ,presence_etudiant pe ,enseignement eng ,classe cls, statut_reclamation sr  where rec.id_user =u.id_user  and u.id_user=e.id_user and e.id_etudiant=pe.id_etudiant and pe.id_enseignement=eng.id_enseignement and eng.id_classe=cls.id_classe and rec.id_statut_reclamation=sr.id_statut_reclamation and  rec.id_statut_reclamation=3 ORDER BY id_reclamation DESC'
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

////////////////////////////////Update Message Recalamation//////////////////////////
exports.updateReclamation=(req,res)=>{
  
  client.query( 'UPDATE reclamation SET message=?,id_statut_reclamation=1 where id_reclamation=? ',
              [req.body.message,req.params.id] , function (err, result) {
      if (err){
          res.status(res.statusCode).json({
              errorCode: err.message,
              status: res.statusCode,
              
            });
      }else{
        res.json({
          status:200,
          message:result
        })
      }
    });

}


////////////////////////////////Update Message//////////////////////////
exports.updateReclamation2=(req,res)=>{
  
  client.query( 'UPDATE reclamation SET id_statut_reclamation=3 where id_reclamation=? ',
            [req.params.id]  , function (err, result) {
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

//////////////////////////////////GetByID //////////////////////
exports.getReclamationById=(req,res)=>{
  client.query( 'select * FROM reclamation rec ,user u, etudiant e ,presence_etudiant pe ,enseignement eng ,classe cls, statut_reclamation sr, type_reclamation tr  where rec.id_user =u.id_user  and u.id_user=e.id_user and e.id_etudiant=pe.id_etudiant and pe.id_enseignement=eng.id_enseignement and eng.id_classe=cls.id_classe and rec.id_statut_reclamation=sr.id_statut_reclamation and rec.id_type_reclamation=tr.id_type_reclamation and id_reclamation=? ',
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
//////////////////////////////////Get All Paper Types //////////////////////
exports.getAllReclamTypes=(req,res)=>{
  client.query( 'select  * from type_reclamation '
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
//Relancer une reclamation 
exports.relancerReclamation=(req,res)=>{
  
  client.query( `INSERT  INTO reclamation (id_reclamation,date_reclamation,id_statut_reclamation,id_type_reclamation,id_user) 
     VALUES ('${req.params.id}','${req.body.date_reclamation}','${req.body.id_statut_reclamation}',
     '${req.body.id_type_reclamation}','${req.body.id_user}')`, function (err, result) {
      if (err){
        res.json({
          status:400,
          message:err
        })
      }else{
        res.json({
          status:200,
          message:"Reclamation Sent"
        })
      }
    });

}

///////////////////////////Select box Value/////////////////////////////
//////////////////////////////// Get class ///////////////////////////
//////////////////////////////////Get All Paper Types //////////////////////
exports.getAllClass=(req,res)=>{
  client.query( 'select  id_classe,libelle from classe '
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
///////////////////////////////////////Get current student class/////////////////////////
exports.getClassByIdEtudiant=(req,res)=>{
  client.query( 'select DISTINCT cls.id_classe,cls.libelle FROM reclamation rec ,user u, etudiant e ,presence_etudiant pe ,enseignement eng ,classe cls, statut_reclamation sr, type_reclamation tr  where rec.id_user =u.id_user  and u.id_user=e.id_user and e.id_etudiant=pe.id_etudiant and pe.id_enseignement=eng.id_enseignement and eng.id_classe=cls.id_classe and rec.id_statut_reclamation=sr.id_statut_reclamation and rec.id_type_reclamation=tr.id_type_reclamation and e.id_etudiant=? ',
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
  //////////////// Get all specialite /////////////////

  exports.getAllSpecialite=(req,res)=>{
    client.query( 'select  id_specialite,libelle from specialite '
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
  ////////////////////////get number reclamation////////////////
  ////////////////////// getAllReclamation ////////////////////////////////////////////////

exports.getNumberReclamation=(req,res)=>{
  client.query( 'SELECT count (*) as nb FROM reclamation rec ,user u, etudiant e ,presence_etudiant pe ,enseignement eng ,classe cls ,type_reclamation tr, statut_reclamation sr  where rec.id_user =u.id_user  and u.id_user=e.id_user and e.id_etudiant=pe.id_etudiant and pe.id_enseignement=eng.id_enseignement and eng.id_classe=cls.id_classe and rec.id_type_reclamation=tr.id_type_reclamation and rec.id_statut_reclamation=sr.id_statut_reclamation ORDER BY id_reclamation DESC',
            [req.params.id] , function (err, result) {
    if (err){
        res.status(res.statusCode).json({
            errorCode: err.message,
            status: res.statusCode,
            
          });
    }else{
      res.json(result);
    }
  });
}
//////////////////////////////////getbyStatutAccepter //////////////////////
exports.getNumberReclamationA=(req,res)=>{
  client.query( 'SELECT count (*) as nb FROM reclamation rec ,user u, etudiant e ,presence_etudiant pe ,enseignement eng ,classe cls , statut_reclamation sr where rec.id_user =u.id_user  and u.id_user=e.id_user and e.id_etudiant=pe.id_etudiant and pe.id_enseignement=eng.id_enseignement and eng.id_classe=cls.id_classe and rec.id_statut_reclamation=sr.id_statut_reclamation and rec.id_statut_reclamation=1 ORDER BY id_reclamation DESC'
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
exports.getNumberReclamationE=(req,res)=>{
  client.query( 'SELECT count (*) as nb FROM reclamation rec ,user u, etudiant e ,presence_etudiant pe ,enseignement eng ,classe cls, statut_reclamation sr  where rec.id_user =u.id_user  and u.id_user=e.id_user and e.id_etudiant=pe.id_etudiant and pe.id_enseignement=eng.id_enseignement and eng.id_classe=cls.id_classe and rec.id_statut_reclamation=sr.id_statut_reclamation and rec.id_statut_reclamation=2 ORDER BY id_reclamation DESC'
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
exports.getNumberReclamationR=(req,res)=>{
  client.query( 'SELECT count (*) as nb FROM reclamation rec ,user u, etudiant e ,presence_etudiant pe ,enseignement eng ,classe cls, statut_reclamation sr  where rec.id_user =u.id_user  and u.id_user=e.id_user and e.id_etudiant=pe.id_etudiant and pe.id_enseignement=eng.id_enseignement and eng.id_classe=cls.id_classe and rec.id_statut_reclamation=sr.id_statut_reclamation and  rec.id_statut_reclamation=3 ORDER BY id_reclamation DESC'
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
exports.getDates=(req,res)=>{
  client.query( 'SELECT  date_reclamation  FROM reclamation rec ORDER BY date_reclamation ASC'
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
exports.getRecNbByMonth=(req,res)=>{
  client.query( 'SELECT MONTH(date_reclamation) AS month, count(id_reclamation) AS nb_reclamation FROM reclamation GROUP BY MONTH(date_reclamation);'
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
exports.getAllReclamationById=(req,res)=>{
  client.query( 'SELECT DISTINCT * FROM reclamation rec ,user u, etudiant e ,presence_etudiant pe ,enseignement eng ,classe cls ,type_reclamation tr, statut_reclamation sr  where rec.id_user = ?  and u.id_user=e.id_user and e.id_etudiant=pe.id_etudiant and pe.id_enseignement=eng.id_enseignement and eng.id_classe=cls.id_classe and rec.id_type_reclamation=tr.id_type_reclamation and rec.id_statut_reclamation=sr.id_statut_reclamation ORDER BY id_reclamation DESC',
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

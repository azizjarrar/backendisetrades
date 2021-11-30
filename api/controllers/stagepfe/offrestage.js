const multer = require("multer");
const query=require('./db_query');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/pdf");
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + ".pdf");
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    if (file.mimetype === "application/pdf") callback(null, true);
    else callback(new Error("cannot upload File type"), false);
  },
});

module.exports.add=(req,res)=>{
    const uploadResult = upload.single("cahier_charge");

    uploadResult(req, res, function (err) {
      const{type,duree,date_debut,date_fin,id_responsable_entreprise,titre,description}=req.body;

      if(req.file){
        if (!err) {
        const path   = "http://localhost:5010/uploads/pdf/" + req.file.filename;
    
        const sql=`INSERT INTO offre_stage (type,duree,date_debut,date_fin,cahier_charge,id_responsable_entreprise,titre,description)
         VALUES ?`;
        const values=[
            [type,duree,date_debut,date_fin,path,id_responsable_entreprise,titre,description]
        ];
        query.sql_request(sql,[values],res,'entreprise');        
    } else {
        res.status(404).json({
          err: true,
          message: "File not uploaded",
        });
      }

      }
      else{
        const sql=`INSERT INTO offre_stage (type,duree,date_debut,date_fin,id_responsable_entreprise,titre,description)
        VALUES ?`;
        const values=[
           [type,duree,date_debut,date_fin,id_responsable_entreprise,titre,description]
       ];
       query.sql_request(sql,[values],res);
      }
});
};

module.exports.getAll=(req,res)=>{
  const {id,year,etat}=req.params
  let sql='';
  let values=[]
  switch (etat) {
    case "2":
      sql=`SELECT * FROM offre_stage o join responsable_entreprise 
      join entreprise e join etat_offre_stage eos join domaine on 		
      domaine.id_domaine=e.id_domaine and 
      o.id_etat_offre_stage=eos.id_etat_offre_stage and
       e.id_entreprises = responsable_entreprise.id_entreprise 
       and responsable_entreprise.id_responsable_entreprise = o.id_responsable_entreprise
        where o.id_responsable_entreprise = ? and o.id_etat_offre_stage ='2' or o.id_etat_offre_stage='3'
        and o.date_debut like ? ORDER by o.date_debut DESC`;
        query.sql_request(sql,[id,"%"+year+"%"],res)
      break;
    case "1":
      values=[id,etat,"%"+year+"%"]
      

      sql=`SELECT * FROM offre_stage o join responsable_entreprise 
      join entreprise e join etat_offre_stage eos join domaine on 		
      domaine.id_domaine=e.id_domaine and 
      o.id_etat_offre_stage=eos.id_etat_offre_stage and
       e.id_entreprises = responsable_entreprise.id_entreprise 
       and responsable_entreprise.id_responsable_entreprise = o.id_responsable_entreprise
        where o.id_responsable_entreprise = ? and o.id_etat_offre_stage =?
        and o.date_debut like ? ORDER by o.date_debut DESC`;
        query.sql_request(sql,values,res)

        break;
  
    default:
      values=[id,"%"+year+"%"]

      sql=`SELECT * FROM offre_stage o join 
      responsable_entreprise resp on resp.id_responsable_entreprise=o.id_responsable_entreprise
      where o.id_responsable_entreprise = ?
      and o.date_debut like ?
      ORDER by o.date_debut DESC`;
      query.sql_request(sql,values,res)

    
      break;
  }
     
};

module.exports.getOne=(req,res)=>{
    const id=req.params.id;
    const sql=`SELECT * FROM offre_stage where id_offre_stage = ?`;
    query.sql_request(sql,[id],res);   
}

module.exports.delete=(req,res)=>{
    const id=req.params.id;
    const sql=`DELETE FROM offre_stage where id_offre_stage = ?`;
    query.sql_request(sql,[id],res);
}

module.exports.update=(req,res)=> {
    const uploadResult = upload.single("cahier_charge");
    uploadResult(req, res, (err)=> {
        const{type,duree,date_debut,date_fin ,titre,description,id_offre_stage}=req.body;
        if(req.file){
          const path = "http://localhost:5010/uploads/pdf/" + req.file.filename;
          if (!err) {
            const sql=`UPDATE offre_stage SET  type = ? , 
            duree = ? , date_debut = ? , date_fin = ? , cahier_charge = ?,
            titre = ? , description = ?  WHERE id_offre_stage = ? `;
            const values=[type,duree,date_debut,date_fin ,path,titre,description,id_offre_stage];
            query.sql_request(sql,values,res);

        }
        else {
          res.status(404).json({
            err: true,
            message: "File not uploaded",
          });
        }
  
      }
      else{
        const sql=`UPDATE offre_stage SET type = ? , 
        duree = ? , date_debut = ? , date_fin = ? , titre=?, description = ? WHERE id_offre_stage = ? `;
        const values=[type,duree,date_debut,date_fin,titre,description,id_offre_stage];
        query.sql_request(sql,values,res);
      }
    });
};




/***********check hanen ******** */
module.exports.getOneOffreEntreprise=(req,res)=> {
  const id=req.params.id;
  const sql=`SELECT * FROM offre_stage o JOIN responsable_entreprise resp join entreprise e 
  JOIN domaine d join etat_demande_stage_entreprise etastg on o.id_responsable_entreprise=resp.id_responsable_entreprise 
  AND resp.id_entreprise = e.id_entreprises and e.id_domaine=d.id_domaine and 
  o.id_etat_offre_stage=etastg.id_etat_demande_stage_entreprise where o.id_offre_stage = ?
   ORDER BY resp.id_responsable_entreprise`;
  query.sql_request(sql,[id],res);
};





module.exports.getAllOffresEntreprise=(req,res)=> {
    const id=req.params.id;

    const sql=`SELECT * FROM responsable_entreprise 
    resp join entreprise e JOIN offre_stage o JOIN
     domaine as d on resp.id_responsable_entreprise = o.id_responsable_entreprise 
     and resp.id_entreprise=e.id_entreprises and e.id_domaine=d.id_domaine
      where resp.id_responsable_entreprise= ?`
    query.sql_request(sql,[id],res);
};

  module.exports.getAllOffresEntreprisNotRegistred=(req,res)=> {
    const {id,year}=req.params;
    
    const sql=`SELECT * from offre_stage join responsable_entreprise resp 
    join entreprise on resp.id_responsable_entreprise=offre_stage.id_responsable_entreprise 
    and entreprise.id_entreprises=resp.id_entreprise WHERE offre_stage.id_offre_stage 
    not in (select o.id_offre_stage from offre_stage o join demande_stage_entreprise d 
    join etudiant e ON o.id_offre_stage=d.id_offre_stage and d.id_etudiant=e.id_etudiant
    where e.id_etudiant = ? ) and offre_stage.id_etat_offre_stage='1' and offre_stage.date_debut LIKE ? ORDER by offre_stage.date_debut DESC`



      query.sql_request(sql,[id,"%"+year+"%"],res)
};

module.exports.updateVue=((req,res)=>{
  const {id_offre_stage}=req.body
  const sql=`UPDATE offre_stage SET nbr_vue = (nbr_vue+1) WHERE id_offre_stage = ? `;
        const values=[id_offre_stage];
        query.sql_request(sql,values,res);
})

module.exports.updatePostulation=((req,res)=>{
  const {id_offre_stage}=req.body
  const sql=`UPDATE offre_stage SET nbr_postulation = (nbr_postulation+1) , nbr_vue = (nbr_vue+1) WHERE id_offre_stage = ? `;
        const values=[id_offre_stage];
        query.sql_request(sql,values,res);
})


module.exports.closeOpenOffre=((req,res)=>{
  const {id_etat_offre,id_offre_stage}=req.body
  const sql=`update offre_stage SET offre_stage.id_etat_offre_stage=? where offre_stage.id_offre_stage=? `;
        query.sql_request(sql,[id_etat_offre,id_offre_stage],res);
})


module.exports.getAllOffresOuvertes=(req,res)=>{
  const {id_responsable}=req.params
 const sql=`SELECT * FROM offre_stage o join responsable_entreprise 
  join entreprise e join etat_offre_stage eos join domaine on 		
  domaine.id_domaine=e.id_domaine and 
  o.id_etat_offre_stage=eos.id_etat_offre_stage and
   e.id_entreprises = responsable_entreprise.id_entreprise 
   and responsable_entreprise.id_responsable_entreprise = o.id_responsable_entreprise
    where o.id_responsable_entreprise = ? and o.id_etat_offre_stage=1`;
  query.sql_request(sql,[id_responsable],res)
}


module.exports.getOffresEtudiantsContactes=(req,res)=>{
  const {id_responsable,id_etudiant}=req.params
 const sql=`SELECT * FROM offre_stage o join responsable_entreprise 
 join entreprise e 	
 join contact_demande_entretien cde join etudiant ON
 etudiant.id_etudiant=cde.id_etudiant AND
 responsable_entreprise.id_responsable_entreprise=cde.id_responsable_entr AND
 o.id_offre_stage=cde.id_offre_stage_entreprise and
  e.id_entreprises = responsable_entreprise.id_entreprise 
  and responsable_entreprise.id_responsable_entreprise = o.id_responsable_entreprise
   where o.id_responsable_entreprise = ? and etudiant.id_etudiant=?`;
  query.sql_request(sql,[id_responsable,id_etudiant],res)
}


module.exports.offreExpired=(req,res)=>{//postponed for later date
  const sql=`UPDATE offre_stage set offre_stage.id_etat_offre_stage = 3 WHERE offre_stage.date_fin < CURDATE() `;
  query.sql_request(sql,null,res)
}

module.exports.loadAllOffres=(req,res)=>{
  const sql=`SELECT * FROM offre_stage o join 
  responsable_entreprise resp on resp.id_responsable_entreprise=o.id_responsable_entreprise
  where o.id_responsable_entreprise = ?
  ORDER by o.date_debut DESC`;
  query.sql_request(sql,[req.params.id_responsable],res);   
}


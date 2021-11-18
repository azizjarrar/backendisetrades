const query=require('./db_query');

module.exports.getAll=(req,res)=>{
    const sql=`SELECT DISTINCT user.*,etudiant.id_etudiant,departement.libelle as departement_lib,
    departement.code as departement_code,niveau.libelle as niveau_etudiant FROM user join etudiant 
    join departement join presence_etudiant JOIN enseignement JOIN matiere 
    join niveau on etudiant.id_etudiant=presence_etudiant.id_etudiant and
     presence_etudiant.id_enseignement = enseignement.id_enseignement and 
     enseignement.id_matiere = matiere.id_matiere and matiere.id_niveau = niveau.id_niveau and 
     etudiant.id_departement=departement.id_departement and user.id_user=etudiant.id_user 
     `;   
    query.sql_request(sql,null,res);
};


module.exports.getDepartementsList=(req,res)=>{
    const sql=`SELECT * from departement`;
    query.sql_request(sql,null,res);
};



module.exports.getCompetenceByEtudiant=(req,res)=>{
    const id_etudiant=req.params.id;
    const sql=`select competence.* from competence join
     cv join etudiant on etudiant.id_etudiant=cv.id_etudiant 
     and competence.id_cv=cv.id_cv WHERE etudiant.id_etudiant = ? ORDER by competence.niveau desc`;
    query.sql_request(sql,[id_etudiant],res);   
};


module.exports.filterByDepartmentCode=(req,res)=>{
    const sql=`SELECT DISTINCT user.*,etudiant.id_etudiant,departement.libelle as departement_lib,
    departement.code as departement_code,niveau.libelle as niveau_etudiant FROM user join etudiant 
    join departement join presence_etudiant JOIN enseignement JOIN matiere 
    join niveau on etudiant.id_etudiant=presence_etudiant.id_etudiant and
     presence_etudiant.id_enseignement = enseignement.id_enseignement and 
     enseignement.id_matiere = matiere.id_matiere and matiere.id_niveau = niveau.id_niveau and 
     etudiant.id_departement=departement.id_departement and user.id_user=etudiant.id_user 
     
     where departement.id_departement=?`;
    query.sql_request(sql,[req.params.idep],res);
};


module.exports.getEtudiontToutContacte=(req,res)=>{
    const sql=`select count(etudiant.id_etudiant) as nbr_contact,etudiant.id_etudiant,user.*,niveau.libelle as niveau_etudiant,departement.libelle as departement_lib from 
    user join etudiant join contact_demande_entretien join responsable_entreprise 
    join presence_etudiant JOIN enseignement JOIN matiere 
    join niveau join departement on etudiant.id_etudiant=presence_etudiant.id_etudiant and
     presence_etudiant.id_enseignement = enseignement.id_enseignement and 
     etudiant.id_departement=departement.id_departement and
     enseignement.id_matiere = matiere.id_matiere and matiere.id_niveau = niveau.id_niveau
      and user.id_user=etudiant.id_user and etudiant.id_etudiant=contact_demande_entretien.id_etudiant 
      and contact_demande_entretien.id_responsable_entr= responsable_entreprise.id_responsable_entreprise
       WHERE responsable_entreprise.id_responsable_entreprise =? GROUP by etudiant.id_etudiant ORDER BY contact_demande_entretien.date_demande DESC`;
    query.sql_request(sql,[req.params.id_resp],res);
};


module.exports.getEtudiontToutContacteBayDep=(req,res)=>{
    const sql=`select distinct etudiant.id_etudiant,user.*,niveau.libelle as niveau_etudiant,departement.libelle 
    as departement_lib  from user join etudiant join contact_demande_entretien join responsable_entreprise 
    join presence_etudiant JOIN enseignement JOIN matiere join niveau join departement on
     etudiant.id_etudiant=presence_etudiant.id_etudiant and presence_etudiant.id_enseignement = enseignement.id_enseignement 
     and etudiant.id_departement=departement.id_departement and enseignement.id_matiere = matiere.id_matiere and matiere.id_niveau = niveau.id_niveau
      and user.id_user=etudiant.id_user and etudiant.id_etudiant=contact_demande_entretien.id_etudiant and 
      contact_demande_entretien.id_responsable_entr= responsable_entreprise.id_responsable_entreprise 
      WHERE responsable_entreprise.id_responsable_entreprise =? and departement.id_departement=? 
      ORDER BY contact_demande_entretien.date_demande DESC`;
    query.sql_request(sql,[req.params.id_resp,req.params.id],res);
};


module.exports.getAllEtudiantsByCompetences=(req,res)=>{

    const sql =`SELECT user.*,etudiant.id_etudiant,competence.libelle,competence.niveau,departement.libelle as departement_lib,
    departement.code as departement_code,niveau.libelle as niveau_etudiant from user join etudiant 
    join cv join competence join departement join presence_etudiant JOIN enseignement JOIN matiere 
    join niveau on etudiant.id_etudiant=presence_etudiant.id_etudiant and
     presence_etudiant.id_enseignement = enseignement.id_enseignement and 
     enseignement.id_matiere = matiere.id_matiere and matiere.id_niveau = niveau.id_niveau and 
     etudiant.id_departement=departement.id_departement and
    user.id_user=etudiant.id_user and etudiant.id_etudiant=cv.id_etudiant
    and cv.id_cv=competence.id_cv where competence.libelle IN (?) GROUP by etudiant.id_etudiant`
    query.sql_request(sql,[req.body.competencesList],res);   
    
}


module.exports.getAllEtudiantsContactesByCompetences=(req,res)=>{
    const sql =`SELECT user.*,etudiant.id_etudiant,competence.libelle,competence.niveau,departement.libelle as departement_lib,
    departement.code as departement_code,niveau.libelle as niveau_etudiant from user join etudiant 
    join cv join competence join departement join presence_etudiant JOIN enseignement JOIN matiere 
    join niveau join contact_demande_entretien on etudiant.id_etudiant=presence_etudiant.id_etudiant and
     presence_etudiant.id_enseignement = enseignement.id_enseignement and 
     enseignement.id_matiere = matiere.id_matiere and matiere.id_niveau = niveau.id_niveau and 
     etudiant.id_departement=departement.id_departement and
    user.id_user=etudiant.id_user and etudiant.id_etudiant=cv.id_etudiant
    and cv.id_cv=competence.id_cv 
    and contact_demande_entretien.id_etudiant=etudiant.id_etudiant
    where competence.libelle IN (?) GROUP by etudiant.id_etudiant`
    query.sql_request(sql,[req.body.competencesList],res);   
  
};

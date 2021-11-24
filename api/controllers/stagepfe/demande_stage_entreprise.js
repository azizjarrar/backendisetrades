const query=require('./db_query');

module.exports.getAllDemandesEntreprise=((req,res)=>{

    const {id,etat,year}=req.params;
    
        const sql=`select * from demande_stage_entreprise d join responsable_entreprise resp 
        join entreprise e join offre_stage o join etat_offre_stage etata_offrere join 
        user join etudiant join etat_demande_stage_entreprise etat_demonde_entriprise 
        on d.id_offre_stage = o.id_offre_stage and 
        o.id_responsable_entreprise=resp.id_responsable_entreprise and 
        resp.id_entreprise=e.id_entreprises and d.id_etudiant=etudiant.id_etudiant 
        and user.id_user=etudiant.id_user and
        o.id_etat_offre_stage=etata_offrere.id_etat_offre_stage and 
        d.id_etat_demande_stage_entreprise=etat_demonde_entriprise.id_etat_demande_stage_entreprise 
        where resp.id_responsable_entreprise=? 
        and etat_demonde_entriprise.id_etat_demande_stage_entreprise= ?  
        and d.id_etat_entretien_stage_pfe='3' 
        and d.date_demande like ?  GROUP BY d.id_demande_stage_entreprise ORDER BY d.date_demande DESC`
        
    
    query.sql_request(sql,[id,etat,"%"+year+"%"],res);        
})


module.exports.updateDemande=((req,res)=>{

    const sql=`update demande_stage_entreprise SET vue = 1 where id_demande_stage_entreprise = ?`
    query.sql_request(sql,[req.body.id_demande],res);        
})

module.exports.updateEtatEntretien=((req,res)=>{
    const {id_etat_entretien_stage_pfe,id_demande_stage_entreprise}=req.body
    const sql=`update demande_stage_entreprise SET demande_stage_entreprise.id_etat_entretien_stage_pfe = ? where demande_stage_entreprise.id_demande_stage_entreprise = ?` 
    query.sql_request(sql,[id_etat_entretien_stage_pfe,id_demande_stage_entreprise],res);        
})

module.exports.getAllCandidatofStage=((req,res)=>{

    const {idStage}=req.params;
    
        const sql=`SELECT user.*, etudiant.* FROM offre_stage join demande_stage_entreprise join etudiant join user 
        on offre_stage.id_offre_stage = demande_stage_entreprise.id_offre_stage 
        and demande_stage_entreprise.id_etudiant = etudiant.id_etudiant
        and etudiant.id_user = user.id_user 
        WHERE offre_stage.id_offre_stage = ?`
        
  
    query.sql_request(sql,[idStage],res);        
})
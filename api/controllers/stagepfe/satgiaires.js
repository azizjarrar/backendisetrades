
const query=require('./db_query');

// module.exports.getAllsatgiares=((req,res)=>{
// const sql=`
// select * from demande_stage_entreprise d join responsable_entreprise resp 
//         join entreprise e join offre_stage o join etat_offre_stage etata_offrere join 
//         user join etudiant join etat_demande_stage_entreprise etat_demonde_entriprise 
//         on d.id_offre_stage = o.id_offre_stage and 
//         o.id_responsable_entreprise=resp.id_responsable_entreprise and 
//         resp.id_entreprise=e.id_entreprises and d.id_etudiant=etudiant.id_etudiant 
//         and user.id_user=etudiant.id_user and
//         o.id_etat_offre_stage=etata_offrere.id_etat_offre_stage and 
//         d.id_etat_demande_stage_entreprise=etat_demonde_entriprise.id_etat_demande_stage_entreprise 
//         where resp.id_responsable_entreprise=?
//        	AND d.id_etat_entretien_stage_pfe=1
//         GROUP BY d.id_demande_stage_entreprise ORDER BY d.date_demande DESC
// `;
// query.sql_request(sql,[req.params.id_responsable],res);        


// })


module.exports.getAllSatgiaresByOffre=((req,res)=>{
        let sql;
        let values;
        const {id_responsable,id_offre_stage}=req.params
        if(id_offre_stage!='-1'){

                sql=`
                select * from demande_stage_entreprise d join responsable_entreprise resp 
                join entreprise e join offre_stage o join etat_offre_stage etata_offrere join 
                user join etudiant join etat_demande_stage_entreprise etat_demonde_entriprise 
                on d.id_offre_stage = o.id_offre_stage and 
                o.id_responsable_entreprise=resp.id_responsable_entreprise and 
                resp.id_entreprise=e.id_entreprises and d.id_etudiant=etudiant.id_etudiant 
                and user.id_user=etudiant.id_user and
                o.id_etat_offre_stage=etata_offrere.id_etat_offre_stage and 
                d.id_etat_demande_stage_entreprise=etat_demonde_entriprise.id_etat_demande_stage_entreprise 
                where resp.id_responsable_entreprise=?
                       AND d.id_etat_entretien_stage_pfe='1' 
                and o.id_offre_stage = ?
                GROUP BY d.id_demande_stage_entreprise ORDER BY d.date_demande DESC
                `;
                values=[id_responsable,id_offre_stage]
        }
        else{

                sql=`
        select * from demande_stage_entreprise d join responsable_entreprise resp 
                join entreprise e join offre_stage o join etat_offre_stage etata_offrere join 
                user join etudiant join etat_demande_stage_entreprise etat_demonde_entriprise 
                on d.id_offre_stage = o.id_offre_stage and 
                o.id_responsable_entreprise=resp.id_responsable_entreprise and 
                resp.id_entreprise=e.id_entreprises and d.id_etudiant=etudiant.id_etudiant 
                and user.id_user=etudiant.id_user and
                o.id_etat_offre_stage=etata_offrere.id_etat_offre_stage and 
                d.id_etat_demande_stage_entreprise=etat_demonde_entriprise.id_etat_demande_stage_entreprise 
                where resp.id_responsable_entreprise=?
                       AND d.id_etat_entretien_stage_pfe=1
                GROUP BY d.id_demande_stage_entreprise ORDER BY d.date_demande DESC
        `;
        values=[id_responsable]

        }

        query.sql_request(sql,values,res);        
        
        
        })




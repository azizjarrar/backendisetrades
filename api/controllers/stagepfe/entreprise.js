const query=require('./db_query');

module.exports.add=(req,res)=>{
    const{nom,registre,localisation,siteweb,domaine}=req.body;
    const sql=`INSERT INTO entreprise (nom_societe,num_reg_commerce,localisation,site_web,id_domaine)
     VALUES ?`;
    const values=[
        [nom,registre,localisation,siteweb,domaine]
    ];
    query.sql_request(sql,[values],res);    
};

module.exports.getAll=(req,res)=>{
    const sql=`SELECT * FROM entreprise`;
    query.sql_request(sql,null,res);
};

module.exports.getOne=(req,res)=>{
    const id=req.params.id;
    const sql=`SELECT * FROM entreprise where id_entreprises = ?`;
    query.sql_request(sql,[id],res);   
};

module.exports.delete=(req,res)=>{
    const id=req.params.id;
    const sql=`DELETE FROM entreprise where id_entreprises = ?`;
    query.sql_request(sql,[id],res);    
};

module.exports.update=(req,res)=> {

    const{id,nom,registre,localisation,siteweb,domaine}=req.body;
    const sql=`UPDATE entreprise SET nom_societe = ? , 
    num_reg_commerce = ? , localisation = ? , site_web = ? , id_domaine = ? WHERE id_entreprises = ? `;
    const values=[nom,registre,localisation,siteweb,domaine,id];
    query.sql_request(sql,values,res);    
};

module.exports.join=(req,res)=>{//deprecated
    const sql=`SELECT * FROM entreprise as e JOIN domaine as d on e.id_domaine=d.id_domaine and d.libelle=? `;
    query.sql_request(sql,["INFORMATIQUE"],res);    
}

module.exports.getEntrepriseInfo=(req,res)=>{
    const sql=`SELECT * FROM entreprise join responsable_entreprise on responsable_entreprise.id_entreprise=entreprise.id_entreprises WHERE responsable_entreprise.id_responsable_entreprise = ?`;
    query.sql_request(sql,[req.params.id_responsable],res);   
};
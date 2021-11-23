const query=require('./db_query');

module.exports.add=(req,res)=>{
    const{nom_entreprise,date_debut,date_fin,description,post,id_cv}=req.body;
    const sql=`INSERT INTO experience (nom_entreprise,date_debut,date_fin,description,post,id_cv) VALUES ?`;
    const values=[
        [nom_entreprise,date_debut,date_fin,description,post,id_cv]
    ];
    query.sql_request(sql,[values],res);
}

exports.getAll=(req,res)=>{
    const id=req.params.id;
    const sql=`SELECT * FROM experience ex join cv join etudiant e on ex.id_cv=cv.id_cv and cv.id_etudiant=e.id_etudiant where e.id_etudiant= ?`;
    query.sql_request(sql,[id],res);   
}

exports.getOne=(req,res)=>{
    const id=req.params.id;
    const sql=`SELECT * FROM experience where id_experience = ?`;
    query.sql_request(sql,[id],res)
}

exports.delete=(req,res)=>{
    const id=req.params.id;
    const sql=`DELETE FROM experience where id_experience = ?`;
    query.sql_request(sql,[id],res);
}

exports.update=(req,res)=> {

    const{nom_entreprise,date_debut,date_fin,description,post,id_experience}=req.body;
    const sql=`UPDATE experience SET nom_entreprise = ?, date_debut= ? ,date_fin= ? ,description= ? ,post= ? WHERE id_experience = ? `;
    const values=[nom_entreprise,date_debut,date_fin,description,post,id_experience]
    query.sql_request(sql,values,res);    
}

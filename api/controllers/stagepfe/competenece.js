const query=require('./db_query');

exports.add=(req,res)=>{

    const{libelle,niveau,id_cv}=req.body;
    const sql=`INSERT INTO competence (libelle,niveau,id_cv) VALUES ?`;
    const values=[
        [libelle,niveau,id_cv]
    ];
    query.sql_request(sql,[values],res);           
}
exports.getAll=(req,res)=>{
    const id=req.params.id;
    const sql=`select * from competence c join cv join etudiant e 
    on c.id_cv=cv.id_cv and cv.id_etudiant = e.id_etudiant where e.id_etudiant= ?`;
    query.sql_request(sql,[id],res);           
}

exports.getOne=(req,res)=>{
    const id=req.params.id;
    const sql=`SELECT * FROM competence where id_competence = ?`;
    query.sql_request(sql,[id],res);        
}
exports.delete=(req,res)=>{
    const id=req.params.id;
    const sql=`DELETE FROM competence where id_competence = ?`;
    query.sql_request(sql,[id],res);           
}
exports.update=(req,res)=> {

    const{libelle,niveau,id_competence}=req.body;
    const sql=`UPDATE competence SET libelle = ?,niveau= ? WHERE id_competence = ? `;
    const values=[libelle,niveau,id_competence];
    query.sql_request(sql,values,res);           
}

exports.getcvByEtudiant=(req,res)=> {
    const sql=`SELECT cv.* FROM user join cv join etudiant 
    on user.id_user=etudiant.id_user AND cv.id_etudiant=etudiant.id_etudiant 
    where etudiant.id_etudiant=? group by id_etudiant`;
    query.sql_request(sql,[req.params.id],res); 
           
}


exports.loadCompetences=(req,res)=>{
    const sql=`select  distinct libelle from competence`;
    query.sql_request(sql,null,res);           
}


exports.filterCompetences=(req,res)=>{
    const sql=`SELECT competence.* from competence join cv join etudiant join departement
     on competence.id_cv=cv.id_cv and cv.id_etudiant=etudiant.id_etudiant and 
     etudiant.id_departement=departement.id_departement WHERE departement.id_departement = ?`;
    query.sql_request(sql,[req.params.idomaine],res);           
}


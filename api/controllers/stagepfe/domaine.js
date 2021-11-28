const query=require('./db_query');

exports.add=(req,res)=>{

    const{libelle}=req.body;
    const sql=`INSERT INTO domaine (libelle) VALUES ?`;
    const values=[
        [libelle]
    ];
    query.sql_request(sql,[values],res);    
}

exports.getAll=(req,res)=>{
    const sql=`SELECT * FROM domaine`;
    query.sql_request(sql,null,res);   
}

exports.getOne=(req,res)=>{
    const id=req.params.id;
    const sql=`SELECT * FROM domaine where id_domaine = ?`;
    query.sql_request(sql,[id],res);
}

exports.delete=(req,res)=>{
    const id=req.params.id;
    const sql=`DELETE FROM domaine where id_domaine = ?`;
    query.sql_request(sql,[id],res);    
}

exports.update=(req,res)=> {
    const{libelle,id_domaine}=req.body;
    const sql=`UPDATE domaine SET libelle = ? WHERE id_domaine = ? `;
    const values=[libelle,id_domaine];
    query.sql_request(sql,values,res);       
}

exports.getEntrepriseDomaine=(req,res)=> {
    const id=req.params.id;
    const sql=`SELECT D.* FROM domaine as D JOIN entreprise as E on E.id_domaine=D.id_domaine 
    and E.id_entreprises = ? ORDER BY E.id_entreprises`;
    query.sql_request(sql,[id],res);    
}
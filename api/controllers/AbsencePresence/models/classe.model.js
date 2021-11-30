const sql=require('../../../../db_connection');




const getListClasse=(data,result)=>{

    sql.query(`select DISTINCT(c.id_classe),c.libelle from classe c , enseignement e WHERE c.id_classe=e.id_classe and e.id_enseignant=${data.body.id_enseignant}`,(err,res)=>{
        if(err){
            console.log("error:",err);
            result(err,null);
            return;
        }

        if(res!==undefined){
            result(null,res);
            return;
        }
        result({kind:"list Classe empty"},null);
    });
 
};




module.exports=getListClasse;
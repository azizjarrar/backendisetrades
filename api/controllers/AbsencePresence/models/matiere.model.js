const sql=require('../../../../db_connection');




const getListMatiere=(data,result)=>{

    sql.query(`SELECT DISTINCT(m.id_matiere),m.libelle FROM enseignement e , matiere m WHERE e.id_enseignant=${data.body.id_enseignant} and e.id_classe=${data.body.id_classe} and m.id_matiere=e.id_matiere`,(err,res)=>{
        if(err){
            console.log("error:",err);
            result(err,null);
            return;
        }

        if(res!==undefined){
            result(null,res);
            return;
        }
        result({kind:"list Matiere empty"},null);
    });
 
};




module.exports=getListMatiere;
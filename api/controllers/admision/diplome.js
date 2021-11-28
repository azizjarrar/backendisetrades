const connexion = require('../../../db_connection');
module.exports.getListDiplomes = (req, res) => {

    connexion.query("SELECT * FROM diplome ORDER by id_diplome", (err, results) => {
        if (err) {
            res.status(500).json({
                err:true,
                results:[]
            });
            return;
        }
        
        if(results.length>0)
           { res.status(200).json({
                err:false,
                results:results,
            });
            return;}
        else
            {res.status(404).json({
                err:false,
                results:[],
                message:"choix n'existe pas",
            }) ;
            return;}
    })
};
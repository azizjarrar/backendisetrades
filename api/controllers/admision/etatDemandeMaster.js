const connexion = require('../../../db_connection');


module.exports.creatEtat = (req, res) => {
    const data = req.body;
    connexion.query(
        "INSERT INTO etat_demande_master(libelle) VALUES (?)",
        [data.libelle],
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err:true,
                    message:err.sqlMessage,
                });
                return;
            }

            if(results.affectedRows>0)
               { res.status(200).json({
                    err:false,
                    results:results,
                });
                return;}
            else
                {res.status(404).json({
                    err:true,
                    results:[],
                    message:"echec lors du stockage",
                }) ;
                return;}
        })
};

module.exports.getListEtat = (req, res) => {

    connexion.query("SELECT * FROM etat_demande_master", (err, results) => {
        if (err) {
            res.status(500).json({
                err:true,
                results:[]
            });
            return;
        }
        
        if(results.length>0)
          {  res.status(200).json({
                err:false,
                results:results,
            });
            return;}
        else
           { res.status(404).json({
                err:false,
                results:[],
                message:"choix n'existe pas",
            }) ;
            return;}
    })
};

module.exports.getEtatById = (req, res) => {
    const id_role = req.params.id;
    connexion.query(
        "SELECT * FROM etat_demande_master where id_etat_demande_master = ?",
        [id_role],
        (err, results) => {
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

module.exports.updateEtat = (req, res) => {
    const data = req.body;
    connexion.query(
        "UPDATE etat_demande_master SET libelle=? where id_etat_demande_master = ?",
        [data.libelle, data.id_role],
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err:true,
                    results:[]
                });
                return;
            }

        if(results.affectedRows>0)
           { res.status(200).json({
                err:false,
                results:results.affectedRows,
            });
            return;}
        else
           { res.status(404).json({
                err:true,
                results:[],
                message:"echec lors du stockage",
            }) ;
            return;}
        })
};

module.exports.deleteEtat = (req, res) => {
    const id_role = req.params.id;
    connexion.query(
        "DELETE FROM etat_demande_master where id_etat_demande_master = ?",
        [id_role],
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err:true,
                    results:[]
                });
                return;
            }

            if(results.affectedRows>0)
                {res.status(200).json({
                    err:false,
                    results:results.affectedRows,
                });
                return;}
            else
              {  res.status(404).json({
                    err:true,
                    results:[],
                    message:"echec lors de suppression",
                }) ;
                return;}
        })
};
const connexion = require('../../../db_connection');


module.exports.createSituation = (req, res) => {
    const data = req.body;
    connexion.query(
        "INSERT INTO situation_etudiant(libelle) VALUES (?)",
        [data.libelle],
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err:true,
                    message:err.sqlMessage,
                });
            }

            else  if(results.affectedRows>0)
                res.status(200).json({
                    err:false,
                    results:results,
                })
            else
                res.status(404).json({
                    err:true,
                    results:[],
                    message:"echec lors du stockage",
                }) 
        })
};

module.exports.getListSituation = (req, res) => {

    connexion.query("SELECT * FROM situation_etudiant", (err, results) => {
        if (err) {
            res.status(500).json({
                err:true,
                results:[]
            });
        }
        
        else if(results.length>0)
            res.status(200).json({
                err:false,
                results:results,
            })
        else
            res.status(404).json({
                err:false,
                results:[],
                message:"choix n'existe pas",
            }) 
    })
};

module.exports.getSituationById = (req, res) => {
    const id_situation_etudiant = req.params.id;
    connexion.query(
        "SELECT * FROM situation_etudiant where id_situation_etudiant = ?",
        [id_situation_etudiant],
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err:true,
                    results:[]
                });
            }
            
            else  if(results.length>0)
                res.status(200).json({
                    err:false,
                    results:results,
                })
            else
                res.status(404).json({
                    err:false,
                    results:[],
                    message:"choix n'existe pas",
                }) 
        })
};

module.exports.updateSituation = (req, res) => {
    const data = req.body;
    connexion.query(
        "UPDATE situation_etudiant SET libelle=? where id_situation_etudiant = ?",
        [data.libelle, data.id_situation_etudiant],
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err:true,
                    results:[]
                });
            }

            else if(results.affectedRows>0)
            res.status(200).json({
                err:false,
                results:results.affectedRows,
            })
        else
            res.status(404).json({
                err:true,
                results:[],
                message:"echec lors du stockage",
            }) 
        })
};

module.exports.deleteSituation = (req, res) => {
    const id_situation_etudiant = req.params.id;
    connexion.query(
        "DELETE FROM situation_etudiant where id_situation_etudiant = ?",
        [id_situation_etudiant],
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err:true,
                    results:[]
                });
            }

            else if(results.affectedRows>0)
                res.status(200).json({
                    err:false,
                    results:results.affectedRows,
                })
            else
                res.status(404).json({
                    err:true,
                    results:[],
                    message:"echec lors de suppression",
                }) 
        })
};
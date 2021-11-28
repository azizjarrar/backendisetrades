const connexion = require('../../../db_connection');

module.exports.createSpecialite = (req, res) => {
    const data = req.body;
    connexion.query(
        "INSERT INTO specialite(libelle, id_domaine) VALUES (?,?)",
        [data.libelle, data.id_domaine],
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err:true,
                    message:err.sqlMessage,
                });
            }

            else   if(results.affectedRows>0)
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
        }
    )
};

module.exports.getListSpecialite = (req, res) => {

    connexion.query("SELECT domaine.id_domaine,domaine.libelle as 'libelled',specialite.id_specialite,specialite.libelle as 'libelles'  FROM specialite,domaine where domaine.id_domaine=specialite.id_domaine",
    (err, results) => {
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

module.exports.getSpecialiteById = (req, res) => {
    const id_specialite = req.params.id;
    connexion.query(
        "SELECT * FROM `specialite` where id_specialite = ?",
            [id_specialite],
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

module.exports.updateSpecialite = (req, res) => {
    const data = req.body;
    connexion.query(
        "UPDATE `specialite` SET `libelle`=? ,`id_domaine`=? where id_specialite = ?",
            [data.libelle,data.id_domaine ,data.id_specialite],
            (err, results) => {
                if (err) {
                    res.status(500).json({
                        err:true,
                        results:[]
                    });
                }

                else  if(results.affectedRows>0)
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

module.exports.deleteSpecialite = (req, res) => {
    const id_specialite = req.params.id;
    connexion.query(
        "DELETE FROM specialite where id_specialite = ?",
        [id_specialite],
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err:true,
                    results:[]
                });
            }

            else  if(results.affectedRows>0)
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

    
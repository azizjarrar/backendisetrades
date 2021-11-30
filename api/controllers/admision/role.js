const connexion = require('../../../db_connection');


module.exports.createRole = (req, res) => {
    const data = req.body;
    connexion.query(
        "INSERT INTO role(libelle) VALUES (?)",
        [data.libelle],
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
        })
};

module.exports.getListRole = (req, res) => {

    connexion.query("SELECT * FROM role", (err, results) => {
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

module.exports.getRoleById = (req, res) => {
    const id_role = req.params.id;
    connexion.query(
        "SELECT * FROM role where id_role = ?",
        [id_role],
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err:true,
                    results:[]
                });
            }
            
            else   if(results.length>0)
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

module.exports.updateRole = (req, res) => {
    const data = req.body;
    connexion.query(
        "UPDATE role SET libelle=? where id_role = ?",
        [data.libelle, data.id_role],
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

module.exports.deleteRole = (req, res) => {
    const id_role = req.params.id;
    connexion.query(
        "DELETE FROM role where id_role = ?",
        [id_role],
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
const connexion = require('../../../db_connection');


module.exports.createBacclaureat = (req, res) => {
    const data = req.body;
    connexion.query(
        "INSERT INTO `bacclaureat`(`annee`, `section`, `mention`, `session`, `moyenne`) VALUES (?,?,?,?,?)",
        [data.annee,data.section,data.mention,data.session,data.moyenne],
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err: true,
                    message: err.sqlMessage,
                });
            }

            if (results.affectedRows > 0)
                {res.status(200).json({
                    err: false,
                    results: results,
                })
                console.log();
                connexion.query(
                    "UPDATE etudiant SET id_bacc=? WHERE id_user =?",
                    [results.insertId, data.id_user])
           
            }
            
            else
                res.status(404).json({
                    err: true,
                    results: [],
                    message: "echec lors du stockage",
                })
        }
    )
};


module.exports.getBacById = (req, res) => {
    const id_user = req.params.id;
    connexion.query(
        "SELECT * FROM bacclaureat where id_bacc = ?",
        [id_user],
        (err, results) => {

            if (err) {   
                res.status(500).json({
                    err: true,
                    results: []
                });
            }
             if(results==undefined){
                 console.log(err,results)
             }
           else if (results.length > 0)
                res.status(200).json({
                    err: false,
                    results: results,
                })
            else
                res.status(404).json({
                    err: false,
                    results: [],
                    message: "choix n'existe pas",
                })
        })
};

module.exports.updateBacclaureat = (req, res) => {
    const data = req.body;
    connexion.query(
        "UPDATE `bacclaureat` SET `annee`=?,`section`=?,`mention`=?,`session`=?,`moyenne`=? where `id_bacc` = ?",
        [data.annee, data.section,data.mention,data.session,data.moyenne,data.id_bacc],
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err: true,
                    results: []
                });
            }

            if (results.affectedRows > 0)
                res.status(200).json({
                    err: false,
                    results: results.affectedRows,
                })
            else
                res.status(404).json({
                    err: true,
                    results: [],
                    message: "echec lors du stockage",
                })
        })
};



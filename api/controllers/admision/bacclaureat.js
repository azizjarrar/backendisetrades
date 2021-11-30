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
                return;
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
                    return;
            }
            
            else
                {res.status(404).json({
                    err: true,
                    results: [],
                    message: "echec lors du stockage",
                });
                return;}
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
                return;
            }
             if(results==undefined){
                 console.log(err,results)
             }
           else if (results.length > 0)
               { res.status(200).json({
                    err: false,
                    results: results,
                });
                return;}
            else
                {res.status(404).json({
                    err: false,
                    results: [],
                    message: "Bac not found",
                });
                return;}
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
                return;
            }

            if (results.affectedRows > 0)
                {res.status(200).json({
                    err: false,
                    results: results.affectedRows,
                });
                return;}
            else
               { res.status(404).json({
                    err: true,
                    results: [],
                    message: "echec lors du stockage",
                });
                return;}
        })
};



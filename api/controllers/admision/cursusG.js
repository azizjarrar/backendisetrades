const connexion = require('../../../db_connection');


module.exports.createCursusG = (req, res) => {
    const data = req.body; 
    connexion.query( 
        "INSERT INTO `cursusgenerale`( `diplome`, `anneeobtentation`, `etablissement`, `domaine`, `specialite`, `Redoublement`) VALUES (?,?,?,?,?,?)",
        [data.diplome,data.anneeobtentation,data.etablissement,data.domaine,data.specialite,data.Redoublement],
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err: true,
                    message: err.sqlMessage,
                });
            } 
            if(results==undefined){
                console.log(results)
                console.log(err)
            } 
           else if (results.affectedRows > 0)
                {res.status(200).json({
                    err: false,
                    results: results,
                })
                console.log();
                connexion.query(
                    "UPDATE etudiant SET id_cursusgenerale=? WHERE id_user =?",
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


module.exports.getCursusGById = (req, res) => {
    const id_user = req.params.id;
    connexion.query(
        "SELECT * FROM cursusgenerale where id_cursusgenerale = ?",
        [id_user],
        (err, results) => {

            if (err) {
                res.status(500).json({
                    err: true,
                    results: []
                });
            }

            if (results.length > 0)
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

module.exports.updateCursusG = (req, res) => {
    const data = req.body;
    connexion.query(
        "UPDATE `cursusgenerale` SET `diplome`=?,`anneeobtentation`=?,`etablissement`=?,`domaine`=?,`specialite`=?,`Redoublement`=? where `id_cursusgenerale` = ?",
        [data.diplome, data.anneeobtentation,data.etablissement,data.domaine,data.specialite,data.Redoublement,data.id_cursusgenerale],
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



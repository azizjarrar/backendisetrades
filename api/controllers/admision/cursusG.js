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
                return;
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
                
                connexion.query(
                    "UPDATE etudiant SET id_cursusgenerale=? WHERE id_user =?",
                    [results.insertId, data.id_user])
                    return;
            }
            
            else
              {  res.status(404).json({
                    err: true,
                    results: [],
                    
                });
                return;}
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
                return;
            }

            if (results.length > 0)
{                res.status(200).json({
                    err: false,
                    results: results,
                });
                return;}
            else
                {res.status(404).json({
                    err: false,
                    results: [],
                   
                });
                return;
            }
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
                return;
            }

            if (results.affectedRows > 0)
               { res.status(200).json({ 
                    err: false,
                    results: results.affectedRows,
                });
                return;}
            else
               { res.status(404).json({
                    err: true,
                    results: [],
                
                });
                return;}
        })
};



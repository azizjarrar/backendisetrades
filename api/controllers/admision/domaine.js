const connexion = require('../../../db_connection');


module.exports.createDomaine = (req, res) => {
    const data = req.body;
    connexion.query(
        "INSERT INTO domaine(libelle) VALUES (?)",
        [data.libelle],
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
                });
                return;}
            else
               { res.status(404).json({
                    err: true,
                    results: [],
                    message: "echec lors du stockage",
                });
                return;}
        }
    )
};

module.exports.getListDomaine = (req, res) => {

    connexion.query(
        "SELECT * FROM domaine",
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err: true,
                    results: []
                });
                return;
            }

            if (results.length > 0)
                {res.status(200).json({
                    err: false,
                    results: results,
                });
                return;}
            else
                {res.status(404).json({
                    err: false,
                    results: [],
                    message: "choix n'existe pas",
                });
                return;}
        })
};

module.exports.getDomaineById = (req, res) => {
    const id_domaine = req.params.id;
    connexion.query(
        "SELECT * FROM domaine where id_domaine = ?",
        [id_domaine],
        (err, results) => {

            if (err) {
                res.status(500).json({
                    err: true,
                    results: []
                });
                return;
            }

            if (results.length > 0)
                {res.status(200).json({
                    err: false,
                    results: results,
                });
                return;
            }
            else
                {res.status(404).json({
                    err: false,
                    results: [],
                    message: "choix n'existe pas",
                });
                return;}
        })
};

module.exports.updateDomaine = (req, res) => {
    const data = req.body;
    connexion.query(
        "UPDATE domaine SET libelle=? where id_domaine = ?",
        [data.libelle, data.id_domaine],
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
              {  res.status(404).json({
                    err: true,
                    results: [],
                    message: "echec lors du stockage",
                });
                return;}
        })
};

module.exports.deleteDomaine = (req, res) => {
    const id_domaine = req.params.id;
    connexion.query(
        "DELETE FROM domaine where id_domaine = ?",
        [id_domaine],
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
                {res.status(404).json({
                    err:true,
                    results:[],
                    message:"echec lors de suppression",
                }) ;
                return;}
        })
};



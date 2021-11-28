const connexion = require('../../../db_connection');

module.exports.getnbApplicantsById = (req, res) => {
    const id_master = req.params.id;
    connexion.query("SELECT COUNT(*) FROM `demande_master` WHERE id_master = ?",
        [id_master],
        (err, results) => {

            if (err) {
                res.status(500).json({
                    err: true,
                    results: []
                });
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
module.exports.createMaster = (req, res) => {
    const data = req.body;
    connexion.query(
        "INSERT INTO master(nom, id_departement, seuil_admission, seuil_admis_attente, date_fin_master, id_etablissement) VALUES (?, ?, ?, ?, ?, ?)",
        [data.nom, data.id_departement, data.seuil_admission, data.seuil_admis_attente, data.date_fin_master, data.id_etablissement],
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err: true,
                    message: err.sqlMessage,
                });
            }

            else  if (results.affectedRows > 0)
                res.status(200).json({
                    err: false,
                    results: results,
                })
            else
                res.status(404).json({
                    err: true,
                    results: [],
                    message: "echec lors du stockage",
                })
        }
    )
};

module.exports.getListMaster = (req, res) => {

    connexion.query("select *,master.nom as mastername from master left join user on master.id_admin_master = user.id_user, departement, etablissement where master.id_departement = departement.id_departement and master.id_etablissement=etablissement.id_etablissement",
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err: true,
                    results: []
                });
            }

            else   if (results.length > 0)
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

module.exports.getMasterById = (req, res) => {
    const id_master = req.params.id;
    connexion.query("select * from master, departement, etablissement where master.id_departement = departement.id_departement and master.id_etablissement=etablissement.id_etablissement and master.id_master = ?",
        [id_master],
        (err, results) => {

            if (err) {
                res.status(500).json({
                    err: true,
                    results: []
                });
            }

            else  if (results.length > 0)
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

module.exports.updateMaster = (req, res) => {
    const data = req.body;
    connexion.query(
        'UPDATE master SET nom=?,id_departement=?,seuil_admission=?,seuil_admis_attente=?,date_fin_master=?,id_etablissement=? WHERE id_master=?',
        [data.nom, data.id_departement, data.seuil_admission, data.seuil_admis_attente, data.date_fin_master, data.id_etablissement, data.id_master],
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err: true,
                    results: []
                });
            }

            else  if (results.affectedRows > 0)
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

module.exports.deleteSpecialite = (req, res) => {
    const id_master = req.params.id;
    connexion.query(
        "DELETE FROM master WHERE id_master=?",
        [id_master],
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err: true,
                    results: []
                });
            }

            else  if (results.affectedRows > 0)
                res.status(200).json({
                    err: false,
                    results: results.affectedRows,
                })
            else
                res.status(404).json({
                    err: true,
                    results: [],
                    message: "echec lors de suppression",
                })
        })
};


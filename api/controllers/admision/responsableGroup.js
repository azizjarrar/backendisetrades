const connexion = require('../../../db_connection');
const bcrypt = require("bcrypt");

module.exports.create = (req, res) => {
    const data = req.body;
    const salt = bcrypt.genSaltSync(10);
    data.password = bcrypt.hashSync(data.password, salt);
    connexion.query(
        'INSERT INTO user( nom, prenom, email, password,age, cin, sexe, num_passport, date_naissance,id_role) VALUES (?,?,?,?,?,?,?,?,?,?)',
        [data.nom, data.prenom, data.email, data.password, data.age, data.cin, data.sexe, data.num_passport, data.date_naissance, 4
        ],
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err: true,
                    message: err.sqlMessage,
                });
            }

            else  if (results.affectedRows > 0) {
                createResponsableGroup(data, results.insertId);

                res.status(200).json({
                    err: false,
                    results: results,
                })
            } else {
                res.status(404).json({
                    err: true,
                    results: [],
                    message: "echec lors du stockage",
                })
            }
        }
    )
};


function createResponsableGroup(data, id_user) {
    connexion.query(
        "INSERT INTO responsable_classe(qualite, id_user) VALUES (?, ?)",
        [data.qualite, id_user]
    );
}

module.exports.getListResponsableGroup = (req, res) => {

    connexion.query("SELECT * FROM responsable_classe,user WHERE responsable_classe.id_user=user.id_user",
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

module.exports.getResponsableGroupById = (req, res) => {
    const id_responsable_group = req.params.id;
    connexion.query(
        "SELECT * FROM responsable_classe,user WHERE responsable_classe.id_user=user.id_user and id_responsable_group = ?",
        [id_responsable_group],
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


module.exports.update = (req, res) => {
    const data = req.body;
    const salt = bcrypt.genSaltSync(10);
    data.password = bcrypt.hashSync(data.password, salt);
    connexion.query('Update user set email = ?, password = ?, id_role = ?, nom = ?, prenom = ?, age = ?, cin = ?, sexe = ?, num_passport = ?, date_naissance = ? where id_user = ?',
        [
            data.email,
            data.password,
            4,
            data.nom,
            data.prenom,
            data.age,
            data.cin,
            data.sexe,
            data.num_passport,
            data.date_naissance,
            data.id_user
        ], (err, results) => {
            if (err) {
                res.status(500).json({
                    err: true,
                    results: err
                });
            }

            else  if (results.affectedRows > 0) {
                updateResponsableGroup(data);
                res.status(200).json({
                    err: false,
                    results: results.affectedRows,
                })
            } else {
                res.status(404).json({
                    err: true,
                    results: [],
                    message: "echec lors du stockage",
                })
            }
        })
};

function updateResponsableGroup(data) {
    connexion.query(
        "UPDATE responsable_classe SET qualite=? where id_user = ?",
        [data.qualite, data.id_user]
    );
}

module.exports.deleteResponsableGroup = (req, res) => {
    const id_responsable_group = req.params.id;
    connexion.query(
        "DELETE FROM responsable_classe where id_responsable_group = ?",
        [id_responsable_group],
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


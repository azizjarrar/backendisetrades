const connexion = require('../../../db_connection');

module.exports.createCursus = (req, res) => {
    const data = req.body;
    connexion.query(
        "INSERT INTO cursus(au_debut,au_fin, moyenne, credit, mention, session, note_pfe, id_domaine, id_etablissement, id_niveau, id_etudiant,id_specialite) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
        [data.au_debut, data.au_fin, data.moyenne, data.credit, data.mention, data.session, data.note_pfe, data.id_domaine, data.id_etablissement, data.id_niveau, data.id_etudiant, data.id_specialite],
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err: true,
                    message: err.sqlMessage,
                });
                return;
            }

            if (results.affectedRows > 0)
               { res.status(200).json({
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

module.exports.getListCursus = (req, res) => {

    connexion.query("SELECT * FROM cursus,domaine,etablissement,etudiant,niveau,user WHERE cursus.id_domaine=domaine.id_domaine and cursus.id_etablissement=etablissement.id_etablissement and cursus.id_niveau=niveau.id_niveau and cursus.id_etudiant = etudiant.id_etudiant and etudiant.id_user=user.id_user",
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
               { res.status(404).json({
                    err: false,
                    results: [],
                    message: "choix n'existe pas",
                });
                return;}
        })
};

module.exports.getCursusById = (req, res) => {
    const id_user = req.params.id;
    connexion.query(
        "SELECT *,niveau.libelle as nlibelle FROM cursus,domaine,etablissement,etudiant,niveau,user WHERE cursus.id_domaine=domaine.id_domaine and cursus.id_etablissement=etablissement.id_etablissement and cursus.id_niveau=niveau.id_niveau and cursus.id_etudiant = etudiant.id_etudiant and etudiant.id_user=user.id_user and user.id_user =?",
        [id_user],
            (err, results) => {

            if (err) {
                res.status(500).json({
                    err:true,
                    results:[]
                });
                return;
            }
            
            if(results.length>0)
              {  res.status(200).json({
                    err:false,
                    results:results,
                });
                return;}
            else
               { res.status(404).json({
                    err:false,
                    results:[],
                    message:"choix n'existe pas",
                }) ;
                return;}
        })
};

module.exports.updateCursus = (req, res) => {
    const data = req.body;
    connexion.query(
        "UPDATE cursus SET au_debut=?, au_fin=?,moyenne=?,credit=?,mention=?,session=?,note_pfe=?,id_domaine=?,id_etablissement=?,id_niveau=? , id_specialite= ? WHERE id_cursus=?",
        [data.au_debut, data.au_fin, data.moyenne, data.credit, data.mention, data.session, data.note_pfe, data.id_domaine, data.id_etablissement, data.id_niveau, data.id_specialite, data.id_cursus],
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
                    message:"echec lors du stockage",
                }) ;
                return;}
        })
};

module.exports.deleteCursus = (req, res) => {
    const id_cursus = req.params.id;
    connexion.query(
        "DELETE FROM cursus WHERE id_cursus=?",
        [id_cursus],
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

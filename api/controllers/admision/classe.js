const connexion = require('../../../db_connection');

module.exports.createClasse = (req, res) => {
    const data = req.body;
    connexion.query(
        "INSERT INTO classe(libelle, id_responsable, nb_etudiant) VALUES (?, ?, ?)",
        [data.libelle, data.id_responsable_group, data.nb_etudiant],
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err:true,
                    message:err.sqlMessage,
                });
                return;
            }

            if(results.affectedRows>0)
               { res.status(200).json({
                    err:false,
                    results:results,
                });
                return;}
            else
               { res.status(404).json({
                    err:true,
                    results:[],
                   
                });
                return; }
        })
};

module.exports.getListClasse = (req, res) => { 

    connexion.query("SELECT * FROM classe,responsable_group,user,adresse WHERE classe.id_responsable=responsable_group.id_responsable_group and responsable_group.id_user=user.id_user and adresse.id_user=user.id_user",
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err:true,
                    results:[]
                });
                return;
            }
            
            if(results.length>0)
                {res.status(200).json({
                    err:false,
                    results:results,
                })
                return;}
            else
               { res.status(404).json({
                    err:false,
                    results:[],
                    message:"choix n'existe pas",
                });
                  return;}
        })
};

module.exports.getClasseById = (req, res) => {
    const id_classe = req.params.id;
    connexion.query(
        "SELECT * FROM classe,responsable_group,user,adresse WHERE classe.id_responsable=responsable_group.id_responsable_group and responsable_group.id_user=user.id_user and adresse.id_user=user.id_user and classe.id_classe = ?",
        [id_classe],
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err:true,
                    results:[]
                });
                return;
            }
            
            if(results.length>0)
               { res.status(200).json({
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

module.exports.updateClasse = (req, res) => {
    const data = req.body;
    connexion.query(
        "UPDATE classe SET libelle=?,id_responsable=?,nb_etudiant=? WHERE id_classe=?",
        [data.libelle, data.id_responsable, data.nb_etudiant, data.id_classe],
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

module.exports.deleteClasse = (req, res) => {
    const id_classe = req.params.id;
    connexion.query(
        "DELETE FROM classe WHERE id_classe=?",
        [id_classe],
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
               { res.status(404).json({
                    err:true,
                    results:[],
                    message:"echec lors de suppression",
                }) ;
                return;}
        })
};

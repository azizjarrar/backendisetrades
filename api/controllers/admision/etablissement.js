const connexion = require('../../../db_connection');

module.exports.createEtablissement = (req, res) => {
    console.log(req.file)
    console.log(req.body)
    if (req.file) {
        const file = "http://localhost:3000/etablissement_logo/" + req.file.filename;
        const data = req.body;
        connexion.query(
            "INSERT INTO etablissement(code_etablissement, libelle, code_postale, rue, ville, gouvernorat_adresse, site_web, logo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [data.code_etablissement, data.libelle, data.code_postale, data.rue, data.ville, data.gouvernorat_adresse, data.site_web, file],
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
                    {res.status(404).json({
                        err: true,
                        results: [],
                        message: "echec lors du stockage",
                    });
                    return;}
            }
        )
    } else {
        res.status(404).json({
            err: true,
            message: "file non existe",
        });
        return;
    }
};

module.exports.getListEtablissement = (req, res) => {

    connexion.query("SELECT * FROM etablissement",
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err: true,
                    results: []
                });
                return;
            }

            if (results.length > 0)
               { res.status(200).json({
                    err: false,
                    results: results,
                });
                return;}
            else
                {res.status(404).json({
                    err: false,
                    results: [],
                });
                return;}
        })
};

module.exports.getEtablissementById = (req, res) => {
    const id_etablissement = req.params.id;
    connexion.query(
        "SELECT * FROM etablissement WHERE id_etablissement = ?",
        [id_etablissement],
            (err, results) => {

            if (err) {
                res.status(500).json({
                    err:true,
                    results:[]
                });
                return;
            }
            
            if(results.length>0)
          {       res.status(200).json({
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

module.exports.updateEtablissement = (req, res) => {
    if (req.file) {
        const file = "http://localhost:3000/etablissement_logo/" + req.file.filename;
        const data = req.body;
    connexion.query(
        "UPDATE etablissement SET code_etablissement= ?, libelle =?, code_postale =?, rue =?, ville = ?, gouvernorat_adresse = ?, site_web = ?, logo = ? where id_etablissement = ?",
        [data.code_etablissement, data.libelle, data.code_postale, data.rue, data.ville, data.gouvernorat_adresse, data.site_web, file, data.id_etablissement],
            (err, results) => {
                if (err) {
                    res.status(500).json({
                        err:true,
                        results:[]
                    });
                    return;
                }

            if(results.affectedRows>0)
                {res.status(200).json({
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

    } else {
        res.status(404).json({
            err: true,
            message: "file non existe",
        });
        return;
    }
};

module.exports.deleteEtablissement = (req, res) => {
    const id_etablissement = req.params.id;
    connexion.query(
        "delete from etablissement where id_etablissement = ?",
        [id_etablissement],
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



const connexion = require('../../../db_connection');


module.exports.getListDepartement = (req, res) => {

    connexion.query("Select * from departement", (err, results) => {
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
            });
            return;}
        else
            {res.status(404).json({
                err:false,
                results:[],
                message:"choix n'existe pas",
            }) ;
            return;}
    })
};

module.exports.createDepartement = (req, res) => {
    const data = req.body;
    connexion.query(
        "INSERT INTO departement(code, libelle, description) VALUES (?, ?, ?)",
        [data.code, data.libelle, data.description],
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
                {res.status(404).json({
                    err:true,
                    results:[],
                    message:"echec lors du stockage",
                }) ;
                return;}
        })
};

module.exports.getDepartementById = (req, res) => {
    const id = req.params.id;
    connexion.query(
        "SELECT * FROM departement where id_departement = ?",
        [id], (err, results) => {
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

module.exports.updateDepartement = (req, res) => {
    const data = req.body;
    connexion.query(
        "UPDATE departement SET code=?,libelle=?,description=? where id_departement = ?",
        [data.code, data.libelle, data.description, data.id_departement],
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
          {  res.status(404).json({
                err:true,
                results:[],
                message:"echec lors du stockage",
            }) ;
            return;}
        })
};

module.exports.deleteDepartement = (req, res) => {
    const id = req.params.id;
    connexion.query(
        "DELETE FROM departement where id_departement = ?",
        [id], (err, results) => {
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
               { res.status(404).json({
                    err:true,
                    results:[],
                    message:"echec lors de suppression",
                }) ;
                return;}
        })
};

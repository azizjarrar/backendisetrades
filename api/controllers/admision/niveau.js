const connexion = require('../../../db_connection');

module.exports.createNiveau = (req, res) => {
    const data = req.body;
    connexion.query(
        "INSERT INTO niveau(libelle) VALUES (?)",
        [data.libelle],
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err:true,
                    message:err.sqlMessage,
                });
            }

           else if(results.affectedRows>0)
                res.status(200).json({
                    err:false,
                    results:results,
                })
            else
                res.status(404).json({
                    err:true,
                    results:[],
                    message:"echec lors du stockage",
                }) 
        })
};

module.exports.getListNiveau = (req, res) => {

    connexion.query("SELECT * FROM niveau", (err, results) => {
        if (err) {
            res.status(500).json({
                err:true,
                results:[]
            });
        }
        
      else  if(results.length>0)
            res.status(200).json({
                err:false,
                results:results,
            })
        else
            res.status(404).json({
                err:false,
                results:[],
                message:"choix n'existe pas",
            }) 
    })
};

module.exports.getNiveauById = (req, res) => {
    const id_niveau = req.params.id;
    connexion.query(
        "SELECT * FROM niveau where id_niveau = ?",
        [id_niveau],
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err:true,
                    results:[]
                });
            }
            
           else if(results.length>0)
                res.status(200).json({
                    err:false,
                    results:results,
                })
            else
                res.status(404).json({
                    err:false,
                    results:[],
                    message:"choix n'existe pas",
                }) 
        })
};

module.exports.updateNiveau = (req, res) => {
    const data = req.body;
    connexion.query(
        "UPDATE niveau SET libelle=? where id_niveau = ?",
        [data.libelle, data.id_niveau],
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err:true,
                    results:[]
                });
            }

        else if(results.affectedRows>0)
            res.status(200).json({
                err:false,
                results:results.affectedRows,
            })
        else
            res.status(404).json({
                err:true,
                results:[],
                message:"echec lors du stockage",
            }) 
        })
};

module.exports.deleteNiveau = (req, res) => {
    const id_niveau = req.params.id;
    connexion.query(
        "DELETE FROM niveau where id_niveau = ?",
        [id_niveau],
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err:true,
                    results:[]
                });
                return;
            }

            if(results.affectedRows>0)
              {  res.status(200).json({
                    err:false,
                    results:results.affectedRows,
                }); return;}
            else
               { res.status(404).json({
                    err:true,
                    results:[],
                 
                }) ; return;}
        })
};



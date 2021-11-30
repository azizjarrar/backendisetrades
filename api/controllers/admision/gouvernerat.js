const connexion = require('../../../db_connection');


module.exports.getListGouvern = (req, res) => {

    connexion.query("SELECT * FROM gouvernerat", (err, results) => {
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

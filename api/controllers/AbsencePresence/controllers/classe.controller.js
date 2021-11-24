const getListClasse = require('../models/classe.model.js');

exports.getListClasse = (req, res) => {

    //console.log(JSON.stringify(req.body.customer));
    // console.log(element.nameCustomer);

    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty !"
        });

    }
    getListClasse(req, (err, data) => {

        if (err) {
            res.status(500).send({
                message: err.kind || "Classe not found."
            });
        } else {
            res.send(data);
        }

    });








}
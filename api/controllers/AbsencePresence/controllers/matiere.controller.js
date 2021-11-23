const getListMatiere = require('../models/matiere.model.js');

exports.getListMatiere = (req, res) => {

    //console.log(JSON.stringify(req.body.customer));
    // console.log(element.nameCustomer);

    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty !"
        });

    }

    getListMatiere(req, (err, data) => {

        if (err) {
            res.status(500).send({
                message: err.kind || "Maitere not found."
            });
        } else {
            res.send(data);
        }

    });








}
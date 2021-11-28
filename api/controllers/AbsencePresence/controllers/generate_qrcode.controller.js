const GenereateQRCODE = require('../models/generate_qrcode.model');

exports.create = (req, res) => {


    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty !"
        });

    }


    GenereateQRCODE.create((err, id_seance) => {
        if (err) {
            res.status(500).send({
                message: err.kind || "Data Not Found"
            });
        } else {
           // GenereateQRCODE.dataForQrCode(req.body.id_enseignant, id_seance, req.body.id_classe, req.body.id_matiere, (err,resultDataForQrCode) => {
            GenereateQRCODE.dataForQrCode(req.body.id_enseignant, id_seance, (err,resultDataForQrCode) => {
                
                    GenereateQRCODE.updateEnseignement(resultDataForQrCode, (err,resultUpdateEnseignement) => {
                        GenereateQRCODE.getDateSemestre(resultDataForQrCode[0].id_matiere, (err,resultDataSemestre) => {
                            GenereateQRCODE.getListEtudiantCurrentClasse(resultDataForQrCode[0].id_classe, resultDataSemestre, (err,listCurrentClasse) => {
                                for (let index = 0; index < listCurrentClasse.length; index++) {
                                    GenereateQRCODE.checkEtudiant(listCurrentClasse[index].id_etudiant,id_seance, (err,resultVerif) => {
                                        if(resultVerif===true){       
                                            GenereateQRCODE.updatePresenceEtudiant(listCurrentClasse[index], resultDataForQrCode, id_seance, (err,resultInsert) => {    
                                            });
                                        }
                                    });
                                }
                                console.log(resultDataForQrCode);
                                res.send({"qr_code":resultDataForQrCode});
                            });
                        })
                    })
            });
        }

    });








}
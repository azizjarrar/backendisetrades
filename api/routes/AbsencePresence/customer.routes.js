const express = require("express");
const app = express.Router();
    const genereate_QrCode = require('../../controllers/AbsencePresence/controllers/generate_qrcode.controller');
    const getListMatiere = require('../../controllers/AbsencePresence/controllers/matiere.controller.js');
    const getListClasse = require('../../controllers/AbsencePresence/controllers/classe.controller.js');
    const etudiant = require('../../controllers/AbsencePresence/controllers/etudiant.controller.js'); 


    app.post("/generate_QRCode",genereate_QrCode.create);
    app.post("/getListClasse",getListClasse.getListClasse);
    app.post("/getListMatiere",getListMatiere.getListMatiere);

    app.post("/checkEtudiant",etudiant.checkUser);
    app.post("/listMatiereEtudiant",etudiant.getListMatiere);
    app.post("/listDetaillMatiereEtudiant",etudiant.getListDetaillMatiere);
    app.post("/scanneQrCode",etudiant.scanneQrCode);
    app.post("/checkGPS",etudiant.checkGPS);

    module.exports = app;


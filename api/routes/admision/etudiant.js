const express = require("express");
const router = express.Router();
const etudiantController=require('../../controllers/admision/etudiant')

const { checkToken } = require("../../middleware/token_validation")

router.post("/", checkToken, etudiantController.createEtudiant);

router.get("/", checkToken, etudiantController.getListEtudiant);

router.get("/:id", checkToken, etudiantController.getEtudiantById);

router.patch("/", checkToken, etudiantController.updateEtudiant);


module.exports = router;

const express = require("express");
const router = express.Router();
const situationController=require('../../controllers/admision/situationEtudiant')

const { checkToken } = require("../../middleware/token_validation")

router.post("/", checkToken, situationController.createSituation);

router.get("/", checkToken, situationController.getListSituation);

router.get("/:id", checkToken, situationController.getSituationById);

router.patch("/", checkToken, situationController.updateSituation);

router.delete("/:id", checkToken, situationController.deleteSituation);

module.exports = router;
 
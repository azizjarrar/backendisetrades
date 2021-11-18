const express = require("express");
const router = express.Router();
const niveauController=require('../../controllers/admision/niveau')

const { checkToken } = require("../../middleware/token_validation")

router.post("/", checkToken, niveauController.createNiveau);

router.get("/", checkToken, niveauController.getListNiveau);

router.get("/:id", checkToken, niveauController.getNiveauById);

router.patch("/", checkToken, niveauController.updateNiveau);

router.delete("/:id", checkToken, niveauController.deleteNiveau);

module.exports = router;
 
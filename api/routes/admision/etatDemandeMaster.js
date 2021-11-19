const express = require("express");
const router = express.Router();
const etatController=require('../../controllers/admision/etatDemandeMaster')

const { checkToken } = require("../../middleware/token_validation")

router.post("/", checkToken, etatController.creatEtat);

router.get("/", checkToken, etatController.getListEtat);

router.get("/:id", checkToken, etatController.getEtatById);

router.patch("/", checkToken, etatController.updateEtat);

router.delete("/:id", checkToken, etatController.deleteEtat);

module.exports = router;
 
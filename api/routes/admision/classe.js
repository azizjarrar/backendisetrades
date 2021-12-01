const express = require("express");
const router = express.Router();
const classeController=require('../../controllers/admision/classe')
const { checkToken } = require("../../middleware/token_validation")


router.post("/", checkToken, classeController.createClasse);

router.get("/", checkToken, classeController.getListClasse);

router.get("/:id", checkToken, classeController.getClasseById);

router.patch("/", checkToken, classeController.updateClasse);

router.delete("/:id", checkToken, classeController.deleteClasse);

module.exports = router;
 
const express = require("express");
const router = express.Router();
const departementController=require('../../controllers/admision/departement')

const { checkToken } = require("../../middleware/token_validation")

router.post("/", checkToken, departementController.createDepartement);

router.get("/", checkToken, departementController.getListDepartement);

router.get("/:id", checkToken, departementController.getDepartementById);

router.patch("/", checkToken, departementController.updateDepartement);

router.delete("/:id", checkToken, departementController.deleteDepartement);

module.exports = router;

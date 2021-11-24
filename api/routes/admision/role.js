const express = require("express");
const router = express.Router();
const roleController=require('../../controllers/admision/role')

const { checkToken } = require("../../middleware/token_validation")

router.post("/", checkToken, roleController.createRole);

router.get("/", checkToken, roleController.getListRole);

router.get("/:id", checkToken, roleController.getRoleById);

router.patch("/", checkToken, roleController.updateRole);

router.delete("/:id", checkToken, roleController.deleteRole);

module.exports = router;
 
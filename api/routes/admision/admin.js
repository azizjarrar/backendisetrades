const express = require("express");
const router = express.Router();
const adminController=require('../../controllers/admision/admin')
const { checkToken } = require("../../middleware/token_validation")


router.post("/login", adminController.getAdminByEmail);

router.get("/:id",checkToken, adminController.getAdmin);

router.patch("/", checkToken, adminController.updateAdmin);


module.exports = router;

 
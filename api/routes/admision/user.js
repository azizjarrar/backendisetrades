 const express = require("express");
const router = express.Router();
const userController=require('../../controllers/admision/user')
const { checkToken } = require("../../middleware/token_validation")


router.post("/login", userController.getUserByUserEmail);

router.post("/", userController.create);

router.get("/", checkToken, userController.getUsers);
router.get("/all", userController.getUsers);

router.get("/:id", userController.getUserByUserId);

router.patch("/", checkToken, userController.updateUser);

router.patch("/forgotPassword", userController.forgotPassword);

router.patch("/resetPassword", userController.resetPassword);

router.patch("/activeVerification", userController.activeInscription);


module.exports = router;



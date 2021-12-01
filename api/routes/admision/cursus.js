const express = require("express");
const router = express.Router();
const cursusController=require('../../controllers/admision/cursus')


router.post("/", cursusController.createCursus);

router.get("/", cursusController.getListCursus);

router.get("/:id", cursusController.getCursusById);

router.patch("/", cursusController.updateCursus);

router.delete("/:id", cursusController.deleteCursus);

module.exports = router;
  
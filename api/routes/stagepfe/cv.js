const express = require("express");
const router = express.Router();
const cvController=require('../../controllers/stagepfe/cv')


router.post("/add", cvController.add);

router.get("/getAll", cvController.getAll);

router.get("/getOne/:id", cvController.getOne);

router.patch("/update", cvController.update);

router.delete("/delete/:id", cvController.delete);

module.exports = router;

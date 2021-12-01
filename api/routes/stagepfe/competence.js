const express = require("express");
const router = express.Router();
const competeneceController=require('../../controllers/stagepfe/competenece')


router.post("/add", competeneceController.add);

router.get("/getAll/:id", competeneceController.getAll);

router.get("/getOne/:id", competeneceController.getOne);

router.patch("/update", competeneceController.update);

router.delete("/delete/:id", competeneceController.delete);

router.get("/getCvByEtudiant/:id", competeneceController.getcvByEtudiant);

router.get("/loadCompetences", competeneceController.loadCompetences);


router.get("/filterCompetences/:idomaine", competeneceController.filterCompetences);


module.exports = router;

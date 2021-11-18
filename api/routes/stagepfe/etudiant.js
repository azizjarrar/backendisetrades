const express = require("express");
const router = express.Router();
const etudiantComp=require('../../controllers/stagepfe/etudiant');

router.get("/getAll", etudiantComp.getAll);
router.get("/getCompetenceByEtudiant/:id", etudiantComp.getCompetenceByEtudiant);
router.get("/getDepartementsList", etudiantComp.getDepartementsList);
router.get("/getFilteredStudents/:idep", etudiantComp.filterByDepartmentCode);
router.get("/getContactedStudents/:id_resp", etudiantComp.getEtudiontToutContacte);
router.get("/getFilteredStudentsContacte/:id/:id_resp", etudiantComp.getEtudiontToutContacteBayDep);

router.post("/getAllEtudiantsByCompetences", etudiantComp.getAllEtudiantsByCompetences);
router.post("/getAllEtudiantsContactesByCompetences", etudiantComp.getAllEtudiantsContactesByCompetences);

module.exports=router;
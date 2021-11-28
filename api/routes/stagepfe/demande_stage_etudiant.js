const express=require('express');
const router=express.Router();
const demandeStageController=require('../../controllers/stagepfe/demande_stage_etudiant');


router.post('/add',demandeStageController.add);

router.get('/getAll',demandeStageController.getAll);

router.get('/getAllDemandesEtudiant/:id/:etat/:year',demandeStageController.getAllDemandesEtudiant);


router.get('/getAllPostulationsEtudiant/:id',demandeStageController.getAllPostulationsEtudiant);//same as getAllDemandesEtudiant



module.exports=router;
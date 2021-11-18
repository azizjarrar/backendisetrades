const express=require('express');
const router=express.Router();
const demandesEntrepriseController=require('../../controllers/stagepfe/demande_stage_entreprise');


router.get('/getAllDemandesEntreprise/:id/:etat/:year',demandesEntrepriseController.getAllDemandesEntreprise);

router.patch('/updateVueDemande',demandesEntrepriseController.updateDemande);
router.patch('/updateEtatEntretien',demandesEntrepriseController.updateEtatEntretien);

router.get('/candidatsOfOffreStagePostuler/:idStage',demandesEntrepriseController.getAllCandidatofStage);
module.exports=router;
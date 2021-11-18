const express = require('express');
const router=express.Router();
const offrestageController=require('../../controllers/stagepfe/offrestage')


router.post('/add',offrestageController.add);

router.get('/getAll/:id/:etat/:year',offrestageController.getAll);


router.get('/getOne/:id',offrestageController.getOne);

router.get('/loadAllOffres/:id_responsable',offrestageController.loadAllOffres);


router.delete('/delete/:id',offrestageController.delete);

router.patch('/update',offrestageController.update);


router.patch('/update_Nbr_vue',offrestageController.updateVue);


router.patch('/update_Nbr_postulations',offrestageController.updatePostulation);


//joins

router.get('/getAllOffresEntreprise/:id',offrestageController.getAllOffresEntreprise);


router.get('/getOneOffreEntreprise/:id',offrestageController.getOneOffreEntreprise);

router.get('/getAllOffresEntreprisNotRegistred/:id/:year',offrestageController.getAllOffresEntreprisNotRegistred);

router.patch('/closeOpenOffre',offrestageController.closeOpenOffre);

router.get('/getAllOffresOuvertes/:id_responsable',offrestageController.getAllOffresOuvertes);


router.get('/getOffresEtudiantsContactes/:id_responsable/:id_etudiant',offrestageController.getOffresEtudiantsContactes);

router.patch('/offreExpired',offrestageController.offreExpired);




module.exports=router
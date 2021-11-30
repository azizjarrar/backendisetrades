const express = require('express');
const router=express.Router();
const entrepriseController=require('../../controllers/stagepfe/entreprise')


router.post('/add',entrepriseController.add);

router.get('/getAll',entrepriseController.getAll);


router.get('/getOne/:id',entrepriseController.getOne);

router.delete('/delete/:id',entrepriseController.delete);

router.patch('/update',entrepriseController.update);

router.get('/join',entrepriseController.join);

router.get('/getOne/:id',entrepriseController.getOne);

router.get('/getEntrepriseInfo/:id_responsable',entrepriseController.getEntrepriseInfo);

module.exports=router
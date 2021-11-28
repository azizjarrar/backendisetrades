const express = require('express');
const router=express.Router();
const stagiaireController=require('../../controllers/stagepfe/satgiaires')

router.get('/getAllSatgiaresByOffre/:id_responsable/:id_offre_stage',stagiaireController.getAllSatgiaresByOffre);


module.exports=router
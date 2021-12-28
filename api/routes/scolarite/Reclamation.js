
const express = require('express');
const router = express.Router()
const Reclamation_controler = require('../../controllers/scolarite/Reclamation')
///////////////////////// add the reclamation methode
router.post('/addReclamation', Reclamation_controler.addReclamation)
///////////////////////// Update the reclamation methode
router.put('/updateReclamation/:id',Reclamation_controler.updateReclamation)
///////////////////////// delete  the reclamation methode
router.delete('/deleteReclamation/:id',Reclamation_controler.deleteReclamation)
///////////////////////// delete function  the reclamation methode
router.get('/get/:id',Reclamation_controler.deleteReclamation)
///////////////////////// get by Id user the reclamation methode
router.get('/get/:id',Reclamation_controler.getReclamationByIdUser)
///////////////////////// get Reclamation By Id the reclamation methode
router.get('/getById/:id',Reclamation_controler.getReclamationById)
///////////////////////// add update relacmation for refuse  reclamation methode
router.put('/updateReclamationRefuser/:id',Reclamation_controler.updateReclamation2)
///////////////////////// resend reclamation the reclamation methode
router.post('/relancerReclamtion/:id',Reclamation_controler.relancerReclamation)
///////////////////////// get reclamation acceted  the reclamation methode
router.get('/getAccpeter',Reclamation_controler.getbyStatutAccepter)
///////////////////////// get reclamation in queu the reclamation methode
router.get('/getEnAttente',Reclamation_controler.getbyStatutEnAttente)
///////////////////////// get reclamation refused the reclamation methode

router.get('/getRefuser',Reclamation_controler.getbyStatutRefuser)
////////////////////// get type reclamations
router.get('/getAllReclamTypes',Reclamation_controler.getAllReclamTypes)
module.exports = router
////////////////////////////Get value select Box//////////////////////////
router.get('/getAllClass', Reclamation_controler.getAllClass)
////////// Get class of user by id

router.get('/getClassByIdEtudiant/:id',Reclamation_controler.getClassByIdEtudiant)
///////////////////////// get all speciality the reclamation methode
router.get('/getAllSpecialite',Reclamation_controler.getAllSpecialite)
///////////////////////// get number of reclamation 
router.get('/getNumberReclamation',Reclamation_controler.getNumberReclamation)
///////////////////////// get number accepted of reclamation the reclamation methode
router.get('/getNumberReclamationA',Reclamation_controler.getNumberReclamationA)
///////////////////////// get number of in queu reclamation the reclamation methode

router.get('/getNumberReclamationE',Reclamation_controler.getNumberReclamationE)
///////////////////////// get number refused reclamation the reclamation methode

router.get('/getNumberReclamationR',Reclamation_controler.getNumberReclamationR)
/////////////////////// get dates of reclamation

router.get('/getDates',Reclamation_controler.getDates)
router.get('/getRecNbByMonth',Reclamation_controler.getRecNbByMonth)
router.get('/getAllReclamtion',Reclamation_controler.getAllReclamation)
router.get('/getAllReclamationById/:id',Reclamation_controler.getAllReclamationById)

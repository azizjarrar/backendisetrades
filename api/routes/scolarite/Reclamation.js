
const express = require('express');
const router = express.Router()
const Reclamation_controler = require('../../controllers/scolarite/Reclamation')
router.post('/addReclamation', Reclamation_controler.addReclamation)
router.put('/updateReclamation/:id',Reclamation_controler.updateReclamation)
router.delete('/deleteReclamation/:id',Reclamation_controler.deleteReclamation)
module.exports = router
////////////////////////////
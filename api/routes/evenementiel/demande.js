const express = require('express');
const router = express.Router()
const demande_controler = require('../../controllers/evenementiel/demande')
router.post('/envoyerDemande', demande_controler.sendRequest)

module.exports = router

const express = require('express');
const router = express.Router()
const checkauth_event = require('../../middleware/check_auth_evenmentiel')
const activite_controle = require('../../controllers/evenementiel/activites')

router.post('/addactivite',checkauth_event ,activite_controle.addactivite)
router.post('/getactivites' ,checkauth_event,activite_controle.getactivites)
router.post('/deleteactivite' ,checkauth_event,activite_controle.deleteactivite)

module.exports = router

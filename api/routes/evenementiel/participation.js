const express = require('express');
const router = express.Router()
const participation_controler = require('../../controllers/evenementiel/participation')
const checkauth_event = require('../../middleware/check_auth_evenmentiel')

router.post('/addParticipation', checkauth_event,participation_controler.addParticipation)
router.post('/getAllParticipation', checkauth_event,participation_controler.getAllParticipation)

module.exports = router

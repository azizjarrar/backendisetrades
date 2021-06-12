const express = require('express');
const router = express.Router()
const sondage_controler = require('../../controllers/evenementiel/sondage')
const checkauth_event = require('../../middleware/check_auth_evenmentiel')

router.post('/getsondage',checkauth_event, sondage_controler.getsondage)
router.post('/addsondage',checkauth_event, sondage_controler.addsondage)
router.post('/deletesondage',checkauth_event, sondage_controler.deletesondage)

router.post('/addVote',checkauth_event, sondage_controler.addVote)
router.post('/getVotes',checkauth_event, sondage_controler.getVotes)
router.post('/getVote', sondage_controler.getVote)

module.exports = router

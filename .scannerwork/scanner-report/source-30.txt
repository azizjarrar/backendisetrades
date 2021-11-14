const express = require('express');
const router = express.Router()
const calander_controler = require('../../controllers/evenementiel/calendrier')
const checkauth_event = require('../../middleware/check_auth_evenmentiel')

router.post('/addcalendar',checkauth_event ,calander_controler.addcalender)
router.post('/getcalendar' ,calander_controler.getcalender)
router.post('/deletecalendar' ,checkauth_event,calander_controler.deletecalender)

module.exports = router

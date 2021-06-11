const express = require('express');
const router = express.Router()
const calander_controler = require('../../controllers/evenementiel/calendrier')
const checkauth_event = require('../../middleware/check_auth_evenmentiel')

router.post('/addcalender',checkauth_event ,calander_controler.addcalender)
router.post('/getcalender' ,calander_controler.getcalender)

module.exports = router

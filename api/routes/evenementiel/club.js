const express = require('express');
const router = express.Router()
const club_controler = require('../../controllers/evenementiel/club')
const checkauth_event = require('../../middleware/check_auth_evenmentiel')

router.post('/getclubs', club_controler.getclubs)
router.post('/getuserClubs',checkauth_event ,club_controler.getuserClubs)

module.exports = router

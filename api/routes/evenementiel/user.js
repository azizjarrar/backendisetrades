const express = require('express');
const router = express.Router()
const auth_controler = require('../../controllers/evenementiel/user')
const checkauth_event = require('../../middleware/check_auth_evenmentiel')

router.post('/getOneUser', auth_controler.getOneUser)
router.post('/getClubUsers', auth_controler.getClubUsers)
router.post('/updateUserInfo',checkauth_event, auth_controler.updateUserInfo)

module.exports = router

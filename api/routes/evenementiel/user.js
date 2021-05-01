const express = require('express');
const router = express.Router()
const auth_controler = require('../../controllers/evenementiel/user')

router.post('/getOneUser', auth_controler.getOneUser)
router.post('/getClubUsers', auth_controler.getClubUsers)

module.exports = router

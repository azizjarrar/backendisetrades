const express = require('express');
const router = express.Router()
const auth_controler = require('../../controllers/evenementiel/roles_and_teams')

router.post('/getroles', auth_controler.getroles)
router.post('/getTeams', auth_controler.getTeams)

module.exports = router

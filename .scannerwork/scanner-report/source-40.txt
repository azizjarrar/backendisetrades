const express = require('express');
const router = express.Router()
const roles_and_teams = require('../../controllers/evenementiel/roles_and_teams')

router.post('/getroles', roles_and_teams.getroles)
router.post('/getTeams', roles_and_teams.getTeams)

module.exports = router

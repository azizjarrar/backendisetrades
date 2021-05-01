const express = require('express');
const router = express.Router()
const auth_controler = require('../../controllers/evenementiel/club')

router.post('/getclubs', auth_controler.getclubs)

module.exports = router

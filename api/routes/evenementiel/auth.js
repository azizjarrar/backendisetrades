const express = require('express');
const router = express.Router()
const auth_controler = require('../../controllers/evenementiel/auth')
router.post('/singin', auth_controler.singin)
router.post('/singup', auth_controler.singup)

module.exports = router

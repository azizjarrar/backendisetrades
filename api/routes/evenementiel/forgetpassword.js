const express = require('express');
const router = express.Router()
const auth_controler = require('../../controllers/evenementiel/forgetpassword')

router.post('/sendEmailForgetPassword', auth_controler.sendEmailForgetPassword)
router.post('/restartPassword/', auth_controler.restartPassword)

module.exports = router

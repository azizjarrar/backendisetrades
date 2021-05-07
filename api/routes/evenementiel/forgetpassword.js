const express = require('express');
const router = express.Router()
const forgetpassword_controler = require('../../controllers/evenementiel/forgetpassword')

router.post('/sendEmailForgetPassword', forgetpassword_controler.sendEmailForgetPassword)
router.post('/restartPassword/', forgetpassword_controler.restartPassword)

module.exports = router

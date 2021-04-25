const express = require('express');
const router = express.Router()
const addFile_controler = require('../../controllers/scolarite/AddFile')
router.post('/add', addFile_controler.add)

module.exports = router
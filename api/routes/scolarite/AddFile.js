
const express = require('express');
const router = express.Router()
const addFile_controler = require('../../controllers/scolarite/AddFile')
router.post('/add', addFile_controler.add)
router.put('/update/:id',addFile_controler.update)
router.delete('/delete/:id',addFile_controler.delete)
router.get('/get/:id',addFile_controler.getById)
module.exports = router
///connection to data base 
const express = require('express');
const router = express.Router()
/// create a controller const will used to identify the controller we work with 
const addFile_controler = require('../../controllers/scolarite/AddFile')
/////////// this url used to add new file 
router.post('/add', addFile_controler.add)
/////////// this url used to update  file 
router.put('/updateAccept/:id',addFile_controler.update)
/////////// this url used to update  file 
router.put('/updateRefuse/:id',addFile_controler.update2)
/////////// this url used to delete  file 
router.delete('/delete/:id',addFile_controler.delete)
/////////// this url used to get data file via id  file 
router.get('/getPapier',addFile_controler.getById)

///////////this will return the file by id file
router.get('/getPapierIdFile/:id',addFile_controler.getByIdPapier)

/////////// this url used to get without reason  file 
router.get('/getR',addFile_controler.getPapierNonRaison)
/////////// this url used to get  all files file 
router.get('/getAll',addFile_controler.getAll)
/////////// this url used to get file with id user  file 
router.get('/getByIdUser/:id',addFile_controler.getByIdUser)
/////////// this url used to get file by accepted  file 
router.get('/getAccpeter',addFile_controler.getbyStatutAccepter)
/////////// this url used to get file by in queu  file 
router.get('/getEnAttente',addFile_controler.getbyStatutEnAttente)
/////////// this url used to get file by in refusd  file 
router.get('/getRefuser',addFile_controler.getbyStatutRefuser)
/////////// this url used to get file by in type  file 
router.get('/getAllPaperTypes',addFile_controler.getAllPaperTypes)
/////////// this url used to get file by in number total of the file demande  file 
router.get('/getAllNumber',addFile_controler.getAllNumber)
/////////// this url used to get file by in number accepted of the file demande  file 

router.get('/getAllNumberA',addFile_controler.getAllNumberA)
/////////// this url used to get file by in number in queu  of the file demande  file 

router.get('/getAllNumberE',addFile_controler.getAllNumberE)
/////////// this url used to get file by in number refused of the file demande  file 

router.get('/getDocNbByMonth',addFile_controler.getDocNbByMonth)


router.get('/getAllNumberR',addFile_controler.getAllNumberR)
///////////  now we going to export all those methode 
module.exports = router
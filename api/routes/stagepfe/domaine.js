const express = require('express');
const router=express.Router();
const domaineController=require('../../controllers/stagepfe/domaine')

router.post('/add',domaineController.add);

router.get('/getAll',domaineController.getAll);

router.get('/getOne/:id',domaineController.getOne);

router.delete('/delete/:id',domaineController.delete);

router.patch('/update',domaineController.update);
//joins

router.get('/getEntrpriseDomaine/:id',domaineController.getEntrepriseDomaine);





module.exports=router
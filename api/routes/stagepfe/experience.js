const express=require('express');
const router=express.Router();
const experienceController=require('../../controllers/stagepfe/experience')



router.post('/add',experienceController.add);

router.get('/getAll/:id',experienceController.getAll);

router.get('/getOne/:id',experienceController.getOne);

router.delete('/delete/:id',experienceController.delete);

router.patch('/update',experienceController.update);

module.exports=router;
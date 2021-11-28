const express = require("express");
const router = express.Router();
const adminMaster=require('../../controllers/admision/adminMaster')
const { checkToken } = require("../../middleware/token_validation")



//creation admin master
router.post("/", adminMaster.createAdminMaster);
//get all admins
router.get("/", checkToken, adminMaster.getAdminsMaster);
//get  admin by id
router.get("/:id",checkToken, adminMaster.getAdminsMasterId);
//update Admin Master
router.patch("/", checkToken, adminMaster.updateAdminMaster);
//check if admin master et inscrit en un master
router.get("/master/:id", adminMaster.checkmasterInscrit);
//if email exist
router.get("/exist/:email", adminMaster.checkemailInscrit);
//update master
router.post("/master", adminMaster.updateMaster);
//create score
router.post("/exportdetaille", adminMaster.exportlstStudentsDetaille);  
router.post("/score", adminMaster.createScore);
router.post("/export", adminMaster.exportlstStudents);
router.get("/score/:id",checkToken, adminMaster.getScore);
router.patch("/score", adminMaster.updateScore);



module.exports = router;



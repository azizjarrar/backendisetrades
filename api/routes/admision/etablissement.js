const express = require("express");
const router = express.Router();
const etablissementController=require('../../controllers/admision/etablissement')
const { checkToken } = require("../../middleware/token_validation")

//Storage file in database -------------
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './etablissement_logo/');
  },
  filename: function(req, file, cb){
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
})


const upload = multer({
  storage: storage
});
//------------------------------


router.post("/", checkToken, upload.single('logo'), etablissementController.createEtablissement);

router.get("/", checkToken, etablissementController.getListEtablissement);

router.get("/:id", checkToken, etablissementController.getEtablissementById);

router.patch("/", checkToken, upload.single('logo'), etablissementController.updateEtablissement);

router.delete("/:id", checkToken, etablissementController.deleteEtablissement);

module.exports = router; 
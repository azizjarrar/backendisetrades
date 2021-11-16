const express = require('express');
const router = express.Router()
const checkauth_event = require('../../middleware/check_auth_evenmentiel')
const activite_controle = require('../../controllers/evenementiel/activites')
/*********************************************************************************/
/*************************upload Files********************************************/
/*********************************************************************************/
const path = require('path')
var fs = require('fs')
var mkdirp = require('mkdirp')
const multer = require('multer')
const crypto = require('crypto')
/*********************************************************************************/
/*********************************************************************************/
/*********************************************************************************/
/********************profile picture multer*********************** */
const storageMulter = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./uploads/authevenmentiel/activite/')
    },
    filename:(req,file,cb)=>{
        crypto.randomBytes(16, (err, buf) => {
            if (err) {
                return reject(err);
            }
             file_name = buf.toString('hex') + path.extname(file.originalname)

             cb(null,file_name)
        })
    }
})
const fileFilter = (req,file,cb)=>{
    if(file.mimetype==='image/jpeg' || file.mimetype==='image/png'){
        cb(null,true)
    }else{
        cb(new Error('type invalide'),false)
    }
}
const uploadMulter = multer({fileFilter:fileFilter,storage:storageMulter})
/**************************check if file exist***************************************/
function checkUploadPath(req, res, next) {
        fs.exists('./uploads/authevenmentiel/activite/', function(exists) {
       if(exists) {
         next();
       }
       else {
           
        mkdirp('./uploads/authevenmentiel/activite/').then(data=>{
            next();
        }).catch(error=>{
            console.log('Error in folder creation='+error.message);
            next();
        })
       }
    })
}

/*********************************************************************************/
/*********************************************************************************/
/*********************************************************************************/
router.post('/addactivite',checkauth_event,checkUploadPath,uploadMulter.array('file',20),activite_controle.addactivite)
router.post('/getactivites' ,checkauth_event,activite_controle.getactivites)
router.post('/deleteactivite' ,checkauth_event,activite_controle.deleteactivite)

module.exports = router

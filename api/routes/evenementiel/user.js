const express = require('express');
const router = express.Router()
const auth_controler = require('../../controllers/evenementiel/user')
const checkauth_event = require('../../middleware/check_auth_evenmentiel')
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
        cb(null,'./uploads/authevenmentiel/userImage/')
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
        fs.exists('./uploads/authevenmentiel/userImage/', function(exists) {
       if(exists) {
         next();
       }
       else {
           
        mkdirp('./uploads/authevenmentiel/userImage/').then(data=>{
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
router.post('/addmemebre', auth_controler.addmemebre)
router.post('/getAllmember', auth_controler.getAllmember)
router.post('/getOneUser', auth_controler.getOneUser)
router.post('/getClubUsers', auth_controler.getClubUsers)
router.post('/getMembres', auth_controler.getMembres)
router.post('/getResponsables', auth_controler.getResponsables)
router.post('/updateUserInfo',checkauth_event, auth_controler.updateUserInfo)
router.post('/updateUserImage',checkauth_event, checkUploadPath,uploadMulter.single('file'),auth_controler.updateUserImage)

module.exports = router

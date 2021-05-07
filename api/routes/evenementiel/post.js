const express = require('express');
const router = express.Router()
const sondage_controler = require('../../controllers/evenementiel/post')
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
        cb(null,'./uploads/authevenmentiel/posts/')
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
        fs.exists('./uploads/authevenmentiel/posts/', function(exists) {
       if(exists) {
         next();
       }
       else {
           
        mkdirp('./uploads/authevenmentiel/posts/').then(data=>{
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
router.post('/getposts',checkauth_event, sondage_controler.getposts)
router.post('/addpost',checkauth_event,checkUploadPath,uploadMulter.single('file'),sondage_controler.addpost)
router.post('/addComment',checkauth_event, sondage_controler.addComment)
router.post('/getComments',checkauth_event, sondage_controler.getComments)

module.exports = router

const express = require('express');
const router = express.Router()
const post_controler = require('../../controllers/evenementiel/publication')
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
router.post('/getposts',checkauth_event, post_controler.getposts)
router.post('/addpost',checkauth_event,checkUploadPath,uploadMulter.single('file'),post_controler.addpost)
router.post('/deletePost',checkauth_event, post_controler.deletePost)

router.post('/addComment',checkauth_event, post_controler.addComment)
router.post('/getComments',checkauth_event, post_controler.getComments)
router.post('/deleteComment',checkauth_event, post_controler.deleteComment)

module.exports = router

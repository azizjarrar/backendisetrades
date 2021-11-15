const express = require('express');
const router = express.Router()
const event_controler = require('../../controllers/evenementiel/evenment')
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
        cb(null,'./uploads/authevenmentiel/event/')
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
        fs.exists('./uploads/authevenmentiel/event/', function(exists) {
       if(exists) {
         next();
       }
       else {
           
        mkdirp('./uploads/authevenmentiel/event/').then(data=>{
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
router.post('/getevents', event_controler.getevents)
router.post('/addevent',checkauth_event,checkUploadPath,uploadMulter.single('file'),event_controler.addevent)
router.post('/getClubEvents',checkauth_event,event_controler.getClubEvents)
router.post('/deleteEvent',checkauth_event,event_controler.deleteEvent)
router.post('/getOneEvent',event_controler.getOneEvent)
router.post('/updateEvent',checkauth_event,event_controler.updateEvent)


module.exports = router

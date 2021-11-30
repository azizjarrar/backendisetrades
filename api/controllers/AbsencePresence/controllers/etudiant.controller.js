const Etudiant = require('../models/etudaint.model.js');

const checkUser = (req,res)=>{
    if(!req.body){
        res.status(400).send({
            message:"Content can not be empty !"
        });
    }

    Etudiant.getUser(req,(err,resultCheckUser)=>{
        if(err){
             res.status(500).send({
                message:"Data Not Found"
             });
             
        }else{
            console.log(resultCheckUser);
            res.send(resultCheckUser);
        }
    })

}


const getListMatiere = (req,res)=>{
    if(!req.body){
        res.status(400).send({
            message:"Content can not be empty !"
        });
    }
    Etudiant.getListMatiere(req,(err,resultListMaitere)=>{
        if(err){
            res.status(500).send({
                message: "Data Not Found2"
            });
        }else{
            Etudiant.getCountAbsence(resultListMaitere,req,(err,resultCountAbsence)=>{
                if(err){
                    res.status(500).send({message:"Data Not Found3"});
                }else{
                    res.send(resultCountAbsence);
                }
            });
        }
    });
}


const getListDetaillMatiere= (req,res)=>{
    if(!req.body){
        res.status(400).send({
            message:"Content can not be empty !"
        });
    }
    Etudiant.getListDetaillMatiere(req,(err,resultListDetaillMatire)=>{
        if(err){
            res.status(500).send({
                message:"Data Not Found3"
            });
        }else{
            res.send(resultListDetaillMatire);
        }
    });
}

const scanneQrCode=(req,res)=>{
    if(!req.body){
        res.status(400).send({
            message:"Content can not be empty !"
        });
    }
    Etudiant.scanneQrCode(req.body.id_etudiant,req.body.dataQrCode,(err,resultScanneQrCode)=>{
        if(err){
            res.status(500).send(
                "error code"
            );
        }else{
            res.send(resultScanneQrCode);
        }
    });
}

 const checkGPS =(req,res)=>{
    if(!req.body){
        res.status(400).send({
            message:"Error Location"
        });
    }
    Etudiant.checkGPS(req.body.location,(err,resultLocation)=>{
        if(err){
            res.status(500).send({
                message:"Error Location"
            });
        }else{
            res.send(resultLocation);
        }
    });

    
} 

module.exports = {
    checkUser,
    getListMatiere,
    getListDetaillMatiere,
    scanneQrCode,
    checkGPS
}
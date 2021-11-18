const express = require("express");
const router = express.Router();
const client = require('../../../db_connection');
const mailjet = require ('node-mailjet')
.connect('f62b4af5a43c5707cd8a241de9bff0ac', 'cf7ecd0c46e2f8926c1af94fbac03c8a');
const mailer = require('nodemailer');
const smtp = require('nodemailer-smtp-transport');


router.post('/sendMail',(req,res)=>{
    const{receivers,subject,text,id_etat_demande_stage_entreprise,id_demande}=req.body;
    const mailPayload={
      receivers,
      subject,
      text
    };
    const values=[id_etat_demande_stage_entreprise,id_demande]
        const sql=`UPDATE demande_stage_entreprise SET id_etat_demande_stage_entreprise = ?
        WHERE id_demande_stage_entreprise = ? `
        updateAndSendmail(sql,values,res,mailPayload,id_etat_demande_stage_entreprise);
    });

function updateAndSendmail(sql,values,res,mailPayload,etat) {
      client.query(sql, values, (err, rows, fields) => {
        if (!err) {
          if (rows.affectedRows > 0){
            if(etat==="1"){

              mailjetFN(mailPayload)
                .then(result=>{
                  res.status(200).json({
                      rows:rows.affectedRows,
                      errorOne:false,
                      rsltOne:result
                      });
                }).catch(error=>{
                  res.status(404).json({
                      rows:rows.affectedRows,
                      errorOne:true,
                      resultOne:error
                      });
                })
            }else{
              res.status(200).json({
                rows:rows.affectedRows,
                err:false,
                });
            }
            }
          else{
            res.status(404).json({
              error: true,
              rows: [],
            });
          }
        } else{

          res.status(500).json({
            error: true,
            message: err.sqlMessage,
          });
        }

      });
    }

router.post('/contactStudent',(req,res)=>{
  const{receivers,subject,text,id_etudiant,id_responsable_entr,id_offre_stage_entreprise}=req.body;
    const mailPayload={
      receivers,
      subject,
      text
    };
    const values=[[[id_etudiant,id_responsable_entr,id_offre_stage_entreprise]]]

  const sql=`INSERT INTO contact_demande_entretien (id_etudiant,id_responsable_entr,id_offre_stage_entreprise)
  VALUES ?`;
  client.query(sql, values, (err, rows, fields) => {
    if (!err) {
      if (rows.affectedRows > 0){

          mailjetFN(mailPayload)
            .then(result=>{
              res.status(200).json({
                  rows:rows.affectedRows,
                  errorTwo:false,
                  rsltTwo:result
                  });
            }).catch(error=>{
              res.status(404).json({
                  rows:rows.affectedRows,
                  errorTwo:true,
                  resultTwo:error
                  });
            })        
        }
      else{
        res.status(404).json({
          error: true,
          rows: [],
        });
      }
    } else{

      res.status(500).json({
        error: true,
        message: err.sqlMessage,
      });
    }

  });


})

async function mailjetFN(mailPayload) {
  const {
      receivers,
      subject,
      text
  }=mailPayload;
  const transport = mailer.createTransport(
    smtp({
      host: 'in.mailjet.com',
      port: 2525,
      auth: {
        user: 'f62b4af5a43c5707cd8a241de9bff0ac' || '<your-mailjet-api-key',
        pass:  'cf7ecd0c46e2f8926c1af94fbac03c8a' || '<your-mailjet-api-secret>',
      },
    })
  );

  return await transport.sendMail({
    from: process.env.EMAIL_MPDAM, // From address
    to: [receivers], // To address
    subject: subject, // Subject
    html: text, // Content
  });
}
module.exports=router

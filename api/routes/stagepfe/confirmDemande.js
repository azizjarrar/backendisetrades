const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');
const client = require('../../../db_connection');

router.post('/sendMail', (req, res) => {
  const { etat, id_demande } = req.body;
  const values = [etat, id_demande]
  const sql = `UPDATE demande_stage_entreprise SET etatDemande = ? 
        WHERE id_demande_stage_entreprise = ? `
  updateAndSendmail(sql, values, res);
});

function updateAndSendmail(sql, values, res) {
  client.query(sql, values, (err, rows) => {
    if (err) {
      res.status(404).json({
        err: true,
        rows: [],
        message: "GOOD REQUEST BUT FAILED TO UPDATE DATA IN demande_stage_entreprise TABLE"
      });
    } else {

      res.status(500).json({
        err: true,
        message: err.sqlMessage,
      });
    }

  });
}

router.post('/testMail', (req, res) => {
  const { receivers, subject, text } = req.body
  sendmail(receivers, subject, text).then(result => {
    res.status(200).json({
      err: false,
      result: result
    });
  }).catch(err => {
    res.status(404).json({
      err: true,
      result: err
    });
  })
});

async function sendmail(receivers, subject, text) {
  try {
    const smtpTransport = ({
      service: 'gmail',
      port: 587,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      },
      secure: false,

    })
    const transport = nodemailer.createTransport(smtpTransport);
    const mailOptions = {
      from: 'youssefbenmiled40@gmail.com',
      to: receivers,
      subject: subject,
      text: text,
      // html:html 
    }
    return await transport.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }

}
module.exports = router;

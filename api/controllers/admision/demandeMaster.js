const connexion = require('../../../db_connection');
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

const mailgun = require("mailgun-js");
const DOMAIN = 'sandbox8cbfcafa2ff54adfabcbdba4ce193360.mailgun.org';
const mg = mailgun({ apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN })

const mailer = require('nodemailer');
const smtp = require('nodemailer-smtp-transport');

module.exports.setToConfirmed = async (req, res) => {
  const token=  req.params.id
  connexion.query("UPDATE demande_master SET id_etat_demande_master=5 WHERE token_demande=?",
  [token],(err,results)=>{
    if (err) {
     
     
       res.redirect('http://localhost:4200/auth')
        return;
    }

    if (results.affectedRows > 0)
       { 
        res.redirect('http://localhost:4200/auth')
        
        return;}
    else
        {
            res.redirect('http://localhost:4200/auth')
        return;}

  }
  )
}
module.exports.confimerpreselection = async (req, res) => {
    const body = req.body;
    const transport = mailer.createTransport(
        smtp({
            host: 'in.mailjet.com',
            port: 2525,
            auth: {
                user: process.env.API_KEY,
                pass: process.env.API_SECRET,
            },
        })
    );
    const jsontoken = sign({ result: body.id_demande }, process.env.JWT_KEY, {
    });
    connexion.query("UPDATE demande_master SET token_demande=? WHERE id_demande=?"
    ,[jsontoken,body.id_demande],(err,res)=>{
        console.log(err);
        console.log(res);
    })
    const json = await transport.sendMail({
      from: process.env.EMAIL,
      to: [body.email],
      subject: 'Confirmation d\inscription au master '+body.master,
      html: 'Bonjour,<br>'
      +"Merci cher utilisateur d'avoir postulé au master "+"<b>"+body.master+"</b>"
      +"<br> Suite à votre présélection, nous vous invite a confirmer votre décision de passer à un entretien"
      +'<br> Cliquer ici ci dessous pour confirmer votre candidature :'
      +`<br>   <p>http://localhost:5010/demandeMaster/confirm/${jsontoken}</p>`
      +'&nbsp;<br>'
      +'&nbsp;<br>'
      +'Cordialement,'

    }).then(
        val=>{
            res.send(val)

        },
        err=>{res.send(err)});

    return json;
}
module.exports.admismaster = async (req, res) => {
    const body = req.body;
    const transport = mailer.createTransport(
        smtp({
            host: 'in.mailjet.com',
            port: 2525,
            auth: {
                user: process.env.API_KEY,
                pass: process.env.API_SECRET,
            },
        })
    );

    const json = await transport.sendMail({
      from: process.env.EMAIL,
      to: [body.email],
      subject: 'Confirmation d\inscription au master '+body.master,
      html: 'Bonjour,<br>'
      +"Merci cher utilisateur d'avoir postulé au master "+"<b>"+body.master+"</b>"
      +"<br> Suite à votre présélection, nous vous invite a confirmer votre décision de passer à un entretien"
      +'<br> Cliquer ici ci dessous pour confirmer votre candidature :'
      +`<br>   <p>http://localhost:4200</p>`
      +'&nbsp;<br>'
      +'&nbsp;<br>'
      +'Cordialement,'

    }).then(
        val=>{
            res.send(val)

        },
        err=>{res.send(err)});

    return json;
}
module.exports.refusmaster = async (req, res) => {
    const body = req.body;
    const transport = mailer.createTransport(
        smtp({
            host: 'in.mailjet.com',
            port: 2525,
            auth: {
                user: process.env.API_KEY,
                pass: process.env.API_SECRET,
            },
        })
    );

    const json = await transport.sendMail({
      from: process.env.EMAIL,
      to: [body.email],
      subject: 'Confirmation d\inscription au master '+body.master,
      html: 'Bonjour,<br>'
      +"Merci cher utilisateur d'avoir postulé au master "+"<b>"+body.master+"</b>"
      +"<br> Après étude  des dossiers qui nous sont parvenus , le comité de sélection a observé"
      +"<br> que plusieurs d'entre vous ne disposent pas  condition nécessaire pour pouvoir accéder " 
      +"<br>  au Master "+body.master
      +`<br>   <p>http://localhost:4200</p>`
      +'&nbsp;<br>'
      +"Nous sommes vraiment désolés et nous vous souhaitons bonne chance dans d'éventuelles opportunités."
      +'Bien Cordialement,'

    }).then(
        val=>{
            res.send(val)

        },
        err=>{res.send(err)});

    return json;
}
module.exports.enattentemaster = async (req, res) => {
    const body = req.body;
    const transport = mailer.createTransport(
        smtp({
            host: 'in.mailjet.com',
            port: 2525,
            auth: {
                user: process.env.API_KEY,
                pass: process.env.API_SECRET,
            },
        })
    );

    const json = await transport.sendMail({
      from: process.env.EMAIL,
      to: [body.email],
      subject: 'Confirmation d\inscription au master '+body.master,
      html: 'Bonjour,<br>'
      +"Merci cher utilisateur d'avoir postulé au master "+"<b>"+body.master+"</b>"
      +"<br> Suite à votre présélection, nous vous invite a confirmer votre décision de passer à un entretien"
      +'<br> Cliquer ici ci dessous pour confirmer votre candidature :'
      +`<br>   <p>http://localhost:4200</p>`
      +'&nbsp;<br>'
      +'&nbsp;<br>'
      +'Cordialement,'

    }).then(
        val=>{
            res.send(val)

        },
        err=>{res.send(err)});

    return json;
}
module.exports.createDemandeMaster = (req, res) => {

    if (req.file) {
        const file = "http://localhost:3000/demande-master/" + req.file.filename;
        const data = req.body;
        envoyerDemande(data.email,data.nomMaster);
        connexion.query(
            "INSERT INTO demande_master(date_inscrit, id_etat_demande_master, id_master, id_etudiant, fichier) VALUES (?,?,?,?,?)",
            [data.date_inscrit, data.id_etat_demande_master, data.id_master, data.id_etudiant, file],
            (err, results) => {
                if (err) {
                    res.status(500).json({
                        err: true,
                        message: err.sqlMessage,
                    });
                    return;
                }

                if (results.affectedRows > 0)
                   { res.status(200).json({
                        err: false,
                        results: results,
                    });
                    return;}
                else
                    {res.status(404).json({
                        err: true,
                        results: [],
                        message: "echec lors du stockage",
                    });
                    return;}
            }
        )
    } else {
        res.status(404).json({
            err: true,
            message: "file non existe",
        });
        return;
    }
};
async function envoyerDemande(email,master) {
    const transport = mailer.createTransport(
        smtp({
            host: 'in.mailjet.com',
            port: 2525,
            auth: {
                user: process.env.API_KEY,
                pass: process.env.API_SECRET,
            },
        })
    );
   
    const json = await transport.sendMail({
      from: process.env.EMAIL,
      to: [email],
      subject: 'Confirmation d\inscription au master '+master,
      html: 'Bonjour,<br>'
      +"Merci cher utilisateur d'avoir postulé au master "+"<b>"+master+"</b>"
      +"<br> on vous contactera à chaque postulation"
      +'&nbsp;<br>'
      +'&nbsp;<br>'
      +'Cordialement,'

    });
 
   
    return json;
}
module.exports.getListDemandeMaster = (req, res) => {

    connexion.query(
        "SELECT *, etablissement.libelle as libelleEtablissement, master.nom as nomMaster,etat_demande_master.libelle as edmlibelle FROM demande_master RIGHT OUTER JOIN master on (demande_master.id_master = master.id_master) Right OUTER join etat_demande_master on(etat_demande_master.id_etat_demande_master=demande_master.id_etat_demande_master) RIGHT OUTER JOIN etudiant on (etudiant.id_etudiant = demande_master.id_etudiant)RIGHT OUTER JOIN  etablissement ON (master.id_etablissement=etablissement.id_etablissement)RIGHT OUTER JOIN  user ON (etudiant.id_user = user.id_user)  RIGHT OUTER JOIN  departement ON (master.id_departement=departement.id_departement)RIGHT OUTER JOIN bacclaureat ON (bacclaureat.id_bacc  =etudiant.id_bacc)  RIGHT OUTER JOIN cursusgenerale ON (cursusgenerale.id_cursusgenerale = etudiant.id_cursusgenerale) ",
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err: true,
                    results: []
                });
                return;
            }

            if (results.length > 0)
                {res.status(200).json({
                    err: false,
                    results: results,
                });
                return;}
            else
                {res.status(404).json({
                    err: false,
                    results: [],
                    message: "choix n'existe pas",
                });
                return;}
        })
};
module.exports.getListDemandeByMaster = async (req, res) => {
    const id_master = req.params.id;
  await  connexion.query(
        "SELECT *, etablissement.libelle as libelleEtablissement, master.nom as nomMaster,etat_demande_master.libelle as edmlibelle FROM demande_master RIGHT OUTER JOIN master on (demande_master.id_master = master.id_master) Right OUTER join etat_demande_master on(etat_demande_master.id_etat_demande_master=demande_master.id_etat_demande_master) RIGHT OUTER JOIN etudiant on (etudiant.id_etudiant = demande_master.id_etudiant)RIGHT OUTER JOIN  etablissement ON (master.id_etablissement=etablissement.id_etablissement)RIGHT OUTER JOIN  user ON (etudiant.id_user = user.id_user)  RIGHT OUTER JOIN  departement ON (master.id_departement=departement.id_departement)RIGHT OUTER JOIN bacclaureat ON (bacclaureat.id_bacc  =etudiant.id_bacc)  RIGHT OUTER JOIN cursusgenerale ON (cursusgenerale.id_cursusgenerale = etudiant.id_cursusgenerale)  WHERE    master.id_master = ?",
        [id_master],
       async (err, results) => {
            if (err) {
                res.status(500).json({
                    err: true,
                    results: []
                });
                return;
            }

            if (results)
              { let resolvednumber=0;
                new Promise ((done, reject) => {
                for (let i=0;i<results.length ;i++) {
                    results[i].lstCursus=[];
                    new Promise ((resolve, reject) => {
                        connexion.query("SELECT *,niveau.libelle as nlibelle FROM cursus,domaine,etablissement,etudiant,niveau,user WHERE cursus.id_domaine=domaine.id_domaine and cursus.id_etablissement=etablissement.id_etablissement and cursus.id_niveau=niveau.id_niveau and cursus.id_etudiant = etudiant.id_etudiant and etudiant.id_user=user.id_user and user.id_user =?",
                        [results[i].id_user],async (err, res)=>{
                            results[i].lstCursus=res;
                            resolve(res);
                        });
                    }).then(()=>{
                        
                        resolvednumber++;
                        if(Number(results.length)===Number(resolvednumber))
                        { 
                         done();
                        }
                    });
                }
            }).then(()=>{
                res.status(200).json({
                    err: false,
                    results: results,
                });
            });

            return;}
            else
               { res.status(404).json({
                    err: false,
                    results: [],
                    message: "choix n'existe pas",
                });
            return;}
        })
}
module.exports.getDemandeMasterById = (req, res) => {
    const id_demande = req.params.id;
    connexion.query(
        "SELECT *, etablissement.libelle as libelleEtablissement, master.nom as nomMaster,etat_demande_master.libelle as edmlibelle FROM demande_master, master,etat_demande_master, etudiant, etablissement,departement,user,adresse WHERE demande_master.id_master = master.id_master and master.id_departement=departement.id_departement and master.id_etablissement=etablissement.id_etablissement and demande_master.id_etudiant = etudiant.id_etudiant and etudiant.id_user = user.id_user and adresse.id_user=user.id_user and etat_demande_master.id_etat_demande_master = demande_master.id_etat_demande_master AND demande_master.id_demande=?",
        [id_demande],
        (err, results) => {

            if (err) {
                res.status(500).json({
                    err: true,
                    results: []
                });
                return;
            }

            if (results.length > 0)
               { res.status(200).json({
                    err: false,
                    results: results,
                });
                return;}
            else
               { res.status(404).json({
                    err: false,
                    results: [],
                    message: "choix n'existe pas",
                });
                return;}
        })
};
module.exports.ChangerEtatDemandeMaster = (req, res) => {


        const data = req.body;
        connexion.query(
            "UPDATE demande_master SET id_etat_demande_master=? WHERE id_demande =?",
            [ data.id_etat_demande_master, data.id_demande],
            (err, results) => {
                if (err) {
                    res.status(500).json({
                        err: true,
                        results: []
                    });
                    return;
                }

                if (results.affectedRows > 0)
                   { res.status(200).json({
                        err: false,
                        results: results.affectedRows,
                    });
                    return;}
                else
                   { res.status(404).json({
                        err: true,
                        results: [],
                        message: "echec lors du stockage",
                    });
                    return;}
            })


};
module.exports.addNoteDemande = (req, res) => {


  const data = req.body;
  connexion.query(
      "UPDATE demande_master SET note_entretien=? WHERE id_demande =?",
      [ data.note_entretien, data.id_demande],
      (err, results) => {
          if (err) {
              res.status(500).json({
                  err: true,
                  results: []
              });
              return;
          }

          if (results.affectedRows > 0)
              {res.status(200).json({
                  err: false,
                  results: results.affectedRows,
              });
              return;}
          else
              {res.status(404).json({
                  err: true,
                  results: [],
                  message: "echec lors du stockage",
              });
              return;}
      })


};
module.exports.updateDemandeMaster = (req, res) => {
    if (req.file) {
        const file = "http://localhost:3000/demande-master/" + req.file.filename;
        const data = req.body;
        connexion.query(
            "UPDATE demande_master SET date_inscrit=?,id_etat_demande_master=?,id_master=?,id_etudiant=?,fichier=? WHERE id_demande =?",
            [data.date_inscrit, data.id_etat_demande_master, data.id_master, data.id_etudiant, file, data.id_demande],
            (err, results) => {
                if (err) {
                    res.status(500).json({
                        err: true,
                        results: []
                    });
                    return;
                }

                if (results.affectedRows > 0)
                    {res.status(200).json({
                        err: false,
                        results: results.affectedRows,
                    });
                    return;}
                else
                   { res.status(404).json({
                        err: true,
                        results: [],
                        message: "echec lors du stockage",
                    });
                    return;}
            })

    } else {
        res.status(404).json({
            err: true,
            message: "file non existe",
        });
        return;
    }
};
module.exports.deleteDemandeMaster = (req, res) => {
    const id_demande = req.params.id;
    connexion.query(
        "DELETE FROM demande_master WHERE id_demande = ?",
        [id_demande],
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err: true,
                    results: []
                });
                return;
            }

            if (results.affectedRows > 0)
               { res.status(200).json({
                    err: false,
                    results: results.affectedRows,
                });
                return;}
            else
                {res.status(404).json({
                    err: true,
                    results: [],
                    message: "echec lors de suppression",
                });
                return;}
        })
};


const connexion = require('../../../db_connection');
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

const mailgun = require("mailgun-js");
const DOMAIN = 'sandbox8cbfcafa2ff54adfabcbdba4ce193360.mailgun.org';
const mg = mailgun({ apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN })

const mailer = require('nodemailer');
const smtp = require('nodemailer-smtp-transport');



module.exports.createDemandeMaster = (req, res) => {

    if (req.file) {
        const file = "http://localhost:3000/demande-master/" + req.file.filename;
        const data = req.body;
        envoyerDemande('bilelhedhli@gmail.com',data.nomMaster);
        connexion.query(
            "INSERT INTO demande_master(date_inscrit, id_etat_demande_master, id_master, id_etudiant, fichier) VALUES (?,?,?,?,?)",
            [data.date_inscrit, data.id_etat_demande_master, data.id_master, data.id_etudiant, file],
            (err, results) => {
                if (err) {
                    res.status(500).json({
                        err: true,
                        message: err.sqlMessage,
                    });
                }

                if (results.affectedRows > 0)
                    res.status(200).json({
                        err: false,
                        results: results,
                    })
                else
                    res.status(404).json({
                        err: true,
                        results: [],
                        message: "echec lors du stockage",
                    })
            }
        )
    } else {
        res.status(404).json({
            err: true,
            message: "file non existe",
        })
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
        "SELECT *, etablissement.libelle as libelleEtablissement, master.nom as nomMaster,etat_demande_master.libelle as edmlibelle FROM demande_master, master,etat_demande_master, etudiant, etablissement,departement,user,adresse,bacclaureat,cursusgenerale WHERE demande_master.id_master = master.id_master and master.id_departement=departement.id_departement and master.id_etablissement=etablissement.id_etablissement and demande_master.id_etudiant = etudiant.id_etudiant and etudiant.id_user = user.id_user and bacclaureat.id_bacc  = etudiant.id_bacc and cursusgenerale.id_cursusgenerale = etudiant.id_cursusgenerale and adresse.id_user=user.id_user and etat_demande_master.id_etat_demande_master = demande_master.id_etat_demande_master",
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err: true,
                    results: []
                });
            }

            if (results.length > 0)
                res.status(200).json({
                    err: false,
                    results: results,
                })
            else
                res.status(404).json({
                    err: false,
                    results: [],
                    message: "choix n'existe pas",
                })
        })
};

module.exports.getListDemandeByMaster = async (req, res) => {
    const id_master = req.params.id;
  await  connexion.query(
        "SELECT *, etablissement.libelle as libelleEtablissement, master.nom as nomMaster,etat_demande_master.libelle as edmlibelle FROM demande_master, master,etat_demande_master, etudiant, etablissement,departement,user,adresse,bacclaureat,cursusgenerale WHERE demande_master.id_master = master.id_master and master.id_departement=departement.id_departement and cursusgenerale.etablissement=etablissement.id_etablissement and demande_master.id_etudiant = etudiant.id_etudiant and etudiant.id_user = user.id_user and bacclaureat.id_bacc  = etudiant.id_bacc and cursusgenerale.id_cursusgenerale = etudiant.id_cursusgenerale and adresse.id_user=user.id_user and etat_demande_master.id_etat_demande_master = demande_master.id_etat_demande_master and master.id_master = ?",
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
                        console.log('in progress',results[i].lstCursus[0].mention);
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
            }

            if (results.length > 0)
                res.status(200).json({
                    err: false,
                    results: results,
                })
            else
                res.status(404).json({
                    err: false,
                    results: [],
                    message: "choix n'existe pas",
                })
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
                }

                if (results.affectedRows > 0)
                    res.status(200).json({
                        err: false,
                        results: results.affectedRows,
                    })
                else
                    res.status(404).json({
                        err: true,
                        results: [],
                        message: "echec lors du stockage",
                    })
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
          }

          if (results.affectedRows > 0)
              res.status(200).json({
                  err: false,
                  results: results.affectedRows,
              })
          else
              res.status(404).json({
                  err: true,
                  results: [],
                  message: "echec lors du stockage",
              })
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
                }

                if (results.affectedRows > 0)
                    res.status(200).json({
                        err: false,
                        results: results.affectedRows,
                    })
                else
                    res.status(404).json({
                        err: true,
                        results: [],
                        message: "echec lors du stockage",
                    })
            })

    } else {
        res.status(404).json({
            err: true,
            message: "file non existe",
        })
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
            }

            if (results.affectedRows > 0)
                res.status(200).json({
                    err: false,
                    results: results.affectedRows,
                })
            else
                res.status(404).json({
                    err: true,
                    results: [],
                    message: "echec lors de suppression",
                })
        })
};


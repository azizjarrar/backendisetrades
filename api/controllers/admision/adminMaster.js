const connexion = require('../../../db_connection');
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const CreateRD=require('./Rapportdetaille')
const CreatePDF=require('./CreateListeOfStudents')
const mailgun = require("mailgun-js");
const DOMAIN = 'sandbox8cbfcafa2ff54adfabcbdba4ce193360.mailgun.org';
const mg = mailgun({ apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN })

const mailer = require('nodemailer');
const smtp = require('nodemailer-smtp-transport');


module.exports.createAdminMaster = (req, res) => {
    const data = req.body;
    const pass =data.password;
    const salt = bcrypt.genSaltSync(10);
    data.password = bcrypt.hashSync(data.password, salt);
    connexion.query('INSERT INTO user(nom, prenom,email, password, age, cin, sexe, num_passport, date_naissance,id_role,gouvern_naissance, id_situation_professionnel) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
        [
            data.nom,
            data.prenom,
            data.email,
            data.password,
            data.age,
            data.cin,
            data.sexe,
            data.num_passport,
            data.date_naissance,
            10,
            data.gouvern_naissance,
            data.id_situation_professionnel
        ],
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err: true,
                    message: err.sqlMessage,
                });
                return;
            }

            if (results.affectedRows > 0) {
                if(createAdresse(data, results.insertId));
                EnvoyerConfirmation(data.email,pass,'').then(result=>{
                    res.status(200).json({
                        //result:result
                    });
                    return;
                  }).catch(err=>{
                    res.status(404).json({
                        result:err
                        });
                        return;
                  })

                    res.status(200).json({
                        err: false,
                        results: results,
                    })
                    return;
            } else {
                res.status(404).json({
                    err: true,
                    results: [],
                    message: "echec lors du stockage",
                });
                return;
            }
        }
    )
};
module.exports.getAdminsMaster = (req, res) => {
    //select * from adresse, situation_professionnel, pays, ville,gouvernerat,master right JOIN user on (master.id_admin_master=user.id_user) where user.id_user = adresse.id_user and adresse.pays = pays.id_pays and adresse.ville =ville.id_ville and adresse.gouvernorat_adresse = gouvernerat.id_gouvernerat and user.id_situation_professionnel= situation_professionnel.id_situation_professionnel and id_role=10
//
    connexion.query('select *,user.nom as admnom from  situation_professionnel,master right outer JOIN user on (master.id_admin_master=user.id_user) where user.id_user and user.id_situation_professionnel= situation_professionnel.id_situation_professionnel and id_role=10',
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
                {res.status(404).json({
                    err: false,
                    results: [],
                    message: "choix n'existe pas",
                });
                return;}
        }
    )
};
module.exports.checkmasterInscrit = (req, res) => {

    connexion.query('select * from user, adresse, situation_professionnel, pays, ville,gouvernerat,master where user.id_user = adresse.id_user and adresse.pays = pays.id_pays and adresse.ville =ville.id_ville and adresse.gouvernorat_adresse = gouvernerat.id_gouvernerat and user.id_situation_professionnel= situation_professionnel.id_situation_professionnel and id_role=10 and master.id_admin_master = user.id_user',
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
              {  res.status(404).json({
                    err: false,
                    results: [],
                    message: "choix n'existe pas",
                });
                return;}
        }
    )
};
module.exports.checkemailInscrit = (req, res) => {
    const email = req.params.email;
    connexion.query('select * from user where user.email = '+email,
        (err, results) => {
            console.log(err)
            if (err) {
                res.status(200).json({
                    err: true,
                    results: []
                });
                return;
            }

            if(results!=undefined){
                if (results)
               { res.status(200).json({
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
            }
        }
    )
};
module.exports.getAdminsMasterId = (req, res, next) => {
    const id_user = req.params.id;
    console.log(id_user)
    const sql = 'select *,user.nom as admnom from user left join master on user.id_user=master.id_admin_master,  situation_professionnel where  user.id_situation_professionnel= situation_professionnel.id_situation_professionnel  and user.id_role=10';
    connexion.query(sql, [id_user], (err, row, fields) => {
        if (!err) {
            if (row.length > 0)
                {res.status(200).json({
                    err: false,
                    results: row,
                });
                return;}
            else
                {res.status(404).json({
                    err: true,
                    results: [],
                    result:row,
                    fields:fields,
                    message: "user non enregistre",
                });
                return;}
        }
        else
           { res.status(500).json({
                err: true,
                message: err.sqlMessage
            });
            return;}
    })
};
function createAdresse(data, id_user) {
    connexion.query('INSERT INTO adresse( code_postale, rue, ville, gouvernorat_adresse, pays, id_user) VALUES (?,?,?,?,?,?)',
        [
            data.code_postale,
            data.rue,
            data.ville,
            data.gouvernorat_adresse,
            data.pays,
            id_user
        ]
    );
}
async function EnvoyerConfirmation(email,mdp,master) {
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
      subject: 'Admin Master : '+master,
      html: 'Bonjour,<br>'
      +"Merci cher admin d'avoir rejoint notre plateforme."
      +"<br> Nous aimerions vous confirmer que votre compte a été créé avec succès. Pour accéder au plateforme, cliquez sur le lien ci-dessous."
      +'<br><a href="http://localhost:5010/auth">Connexion</a>'
      +'<br>Voici Votre Identifiant & mot de passe'
      +'<br><label>Identifiant  : '+email+'</label>'
      +'<br><label>Mot de passe : '+mdp+'</label>'
      +'&nbsp;<br>'
      +'&nbsp;<br>'
      +'Cordialement,'

    });
    console.log(json);
    return json;
  }

  module.exports.updateAdminMaster = (req, res) => {
    const data = req.body;
    const salt = bcrypt.genSaltSync(10);
    console.log(req)
    data.password = bcrypt.hashSync(data.password, salt);
    connexion.query(
        'Update user set email = ?, password = ?, id_role = 10, nom = ?, prenom = ?, age = ?, cin = ?, sexe = ?, num_passport = ?, date_naissance = ?, gouvern_naissance=? where id_user = ?',
        [
            data.email,
            data.password,
            data.nom,
            data.prenom,
            data.age,
            data.cin,
            data.sexe,
            data.num_passport,
            data.date_naissance,
            data.gouvern_naissance,
            data.id_user
        ], (err, results) => {
            if (err) {
                res.status(500).json({
                    err: true,
                    results: err
                });
                return;
            }

            if (results.affectedRows > 0) {
                updateAdresse(data)
                res.status(200).json({
                    err: false,
                    results: results.affectedRows,
                });
                return;
            } else {
                res.status(404).json({
                    err: true,
                    results: err,
                    message: "echec lors du stockage",
                });
                return;
            }
        })
};

function updateAdresse(data) {
    connexion.query('update adresse set code_postale = ?, rue = ?, ville = ?, gouvernorat_adresse = ?, pays = ? where id_user = ?',
        [
            data.code_postale,
            data.rue,
            data.ville,
            data.gouvernorat_adresse,
            data.pays,
            data.id_user
        ]
    )
}
module.exports.updateMaster = (req, res) => {
    const data = req.body;
    connexion.query(
        'UPDATE master SET id_admin_master=? WHERE id_master=?',
        [data.id_admin_master, data.id_master],
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err: true,
                    results: []
                });
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
module.exports.createScore2= (req, res) => {
    const data = req.body;
    connexion.query(
        "INSERT INTO `Score`(`id_master_score`, `RED0`, `RED1`, `RED2`, `RED3`, `RED4`, `BnS`, `Pass`, `AssB`, `Bien`, `TBien`, `BC`, `CdM`, `sem5`) VALUES"
        +'(?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [data.id_master,data.Malus.RED0,data.Malus.RED1,data.Malus.RED2,data.Malus.RED3,data.Malus.RED4,data.BnS,data.BnM.Pass,data.BnM.AssB,data.BnM.Bien,data.BnM.TBien,data.BC,data.CdM,data.sem5],
        (err, results) => {
            if (err) {
                res.status(500).json({
                    err:true,
                    message:err.sqlMessage,
                });
                return;
            }

            if(results)
              {  res.status(200).json({
                    err:false,
                    results:results,
                });
                return;}
            else
                {res.status(404).json({
                    err:true,
                    results:[],
                    message:"echec lors du stockage",
                });
                return;}
        })
};
module.exports.createScore=(req,res)=>{
  //INSERT INTO `table_score`( `nom_attr_score`, `attr_score`, `valeur`, `id_master_score`) VALUES (?,?,?,?)
  const data = req.body;
  data.rows.forEach(elem => {
    connexion.query(
      'INSERT INTO `table_score`( `nom_attr_score`, `attr_score`, `valeur`, `id_master_score`,`active`) VALUES'
      +' (?,?,?,?,?)',
      [elem.name,elem.attr,elem.value,data.id_master,elem.active],
      (err, results) => {
        console.log("err",err)
      }
      )
  });
}
module.exports.updateScore=(req,res)=>{
  const data = req.body;
  data.rows.forEach(elem => {

    connexion.query(
    '  UPDATE `table_score` SET `valeur`=?,`active`=? WHERE `id_master_score`= ? and attr_score="'+elem.attr+'"',
      [elem.value,elem.active,data.id_master,elem.attr],

      (err, results) => {
        console.log("err",err)
      })
  });
}
//
module.exports.getScore = (req, res, next) => {
    const id_user = req.params.id;
    const sql = 'SELECT * FROM `table_score` WHERE table_score.id_master_score= ?';
    connexion.query(sql, [id_user], (err, row, fields) => {
        if (!err) {
            if (row.length > 0)
               { res.status(200).json({
                    err: false,
                    results: row,
                });
                return;}
            else
                {res.status(404).json({
                    err: true,
                    results: [],
                    result:row,
                    fields:fields,
                });
                return;}
        }
        else
            res.status(500).json({
                err: true,
                message: err.sqlMessage
            });
    })
};
module.exports.updateScore2 = (req, res) => {
    const data = req.body;
    connexion.query(
        'UPDATE `Score` SET`RED0`=?,`RED1`=?,`RED2`=?,`RED3`=?,`RED4`=?,`BnS`=?,`Pass`=?,`AssB`=?,`Bien`=?,`TBien`=?,`BC`=?,`CdM`=?,`sem5`=? WHERE id_master_score= ?',
        [data.Malus.RED0,data.Malus.RED1,data.Malus.RED2,data.Malus.RED3,data.Malus.RED4,data.BnS,data.BnM.Pass,data.BnM.AssB,data.BnM.Bien,data.BnM.TBien,data.BC,data.CdM,data.sem5,data.id_master],
         (err, results) => {
            if (err) {
                res.status(500).json({
                    err: true,
                    results: err
                });
                return;
            }

            if (results.affectedRows > 0) {
                updateAdresse(data)
                res.status(200).json({
                    err: false,
                    results: results.affectedRows,
                });
                return;
            } else {
                res.status(404).json({
                    err: true,
                    results: err,
                    message: "echec lors du stockage",
                });
                return;
            }
        })
};
module.exports.exportlstStudents =(req,res)=>{
  const data = req.body;

  Promise.resolve().then(async()=>{
    await CreatePDF.createInvoice(data,"invoice.pdf");

    }).then(()=>{
      setTimeout(()=>{

       res.download("invoice.pdf");
      },3000);

    })
    
}
module.exports.exportlstStudentsDetaille =(req,res)=>{
    const data = req.body;
  
    Promise.resolve().then(async()=>{
      await CreateRD.createReport(data,"invoice.pdf");
  
      }).then(()=>{
        setTimeout(()=>{
  
        res.download("invoice.pdf");
        },3000);
  
      })
  }

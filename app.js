const express = require('express')
const morgan = require('morgan')
const app = express()
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const id_Server = "192.168.118.228";

var mysql = require('mysql');
dotenv.config();
var client = require('./db_connection');
const path = require('path');


var mysql = require('mysql');
dotenv.config();
const accesControl = require('./api/middleware/accesControl')
/******************************************************/
/***************import routes here*********************/
/*******************************************************/

/********************************/
/***group evenementiel routers***/
/********************************/
const auth_evenementiel_route_auth_event= require('./api/routes/evenementiel/auth')
const auth_evenementiel_route_demande_event= require('./api/routes/evenementiel/demande')
const auth_evenementiel_route_roles_and_teams = require('./api/routes/evenementiel/roles_and_teams')
const auth_evenementiel_route_user = require('./api/routes/evenementiel/user')
const auth_evenementiel_route_club = require('./api/routes/evenementiel/club')
const auth_evenementiel_route_forgetpassword = require('./api/routes/evenementiel/forgetpassword')
const auth_evenementiel_route_sondage = require('./api/routes/evenementiel/sondage')
const auth_evenementiel_route_post=require('./api/routes/evenementiel/post')
const auth_evenementiel_route_evenment=require('./api/routes/evenementiel/evenment')
const auth_evenementiel_route_calendrier=require('./api/routes/evenementiel/calendrier')
const auth_evenementiel_route_participation=require('./api/routes/evenementiel/participation')
const auth_evenementiel_route_activites=require('./api/routes/evenementiel/activites')
/********************************/
/***group stage pfe routers******/
/********************************/
const entrepriseRouter = require('./api/routes/stagepfe/entreprise');
const domaineeRouter = require('./api/routes/stagepfe/domaine');
const offreStageRouter = require('./api/routes/stagepfe/offrestage');
const experienceRouter = require('./api/routes/stagepfe/experience');
const cvRouter = require('./api/routes/stagepfe/cv');
const demandeStageEtudiantRouter = require('./api/routes/stagepfe/demande_stage_etudiant');
const deamndeStageEntrepriseRouter = require('./api/routes/stagepfe/demande_stage_entreprise');

const competenceRouter = require('./api/routes/stagepfe/competence');
const confirmationDemandeRouter = require('./api/routes/stagepfe/confirmationDemande');
const etudiantComp=require('./api/routes/stagepfe/etudiant');
const stagiaires=require('./api/routes/stagepfe/stagiaires');

/********************************/
/***group scolarite routers******/
/********************************/
/////////////File ////////////////////////
const File= require('./api/routes/scolarite/AddFile')

/////////////reclamation////////////////
const Reclamation= require('./api/routes/scolarite/Reclamation')


////////////////////////////////////Get all field of select box//////////////////////////////
const getAllClass = require('./api/routes/scolarite/Reclamation')
const getClassByIdEtudiant = require('./api/routes/scolarite/Reclamation')
const getAllSpecialite = require('./api/routes/scolarite/Reclamation')
const con=require('./db_connection')

/********************************/
/**group administration routers**/
/********************************/

/********************************/
/****group admision routers******/
/********************************/
const adminRouter = require('./api/routes/admision/admin');
const classeRouter = require('./api/routes/admision/classe');
const demandeMasterRouter = require('./api/routes/admision/demandeMaster');
const departementRouter = require('./api/routes/admision/departement');
const domaineRouter = require('./api/routes/admision/domaine');
const etablissementRouter = require('./api/routes/admision/etablissement');
const etudiantRouter = require('./api/routes/admision/etudiant');
const masterRouter = require('./api/routes/admision/master');
const niveauRouter = require('./api/routes/admision/niveau');
const responsableGroupRouter = require('./api/routes/admision/responsableGroup');
const roleRouter = require('./api/routes/admision/role');
const specialiteRouter = require('./api/routes/admision/specialite');
const userRouter = require('./api/routes/admision/user');
const situationRouter = require('./api/routes/admision/situationEtudiant');
const etatRouter = require('./api/routes/admision/etatDemandeMaster');
const paysRouter = require('./api/routes/admision/pays');
const gouvernRouter = require('./api/routes/admision/gouvernerat');
const villeRouter = require('./api/routes/admision/ville');
const AdminMaster = require('./api/routes/admision/adminMaster');
const AbPr= require('./api/routes/AbsencePresence/customer.routes')
const cursusRouter = require('./api/routes/admision/cursus');
const bacRouter = require('./api/routes/admision/bacclaureat');
const CursusGRouter = require('./api/routes/admision/cursusG');
const diplomeRouter = require('./api/routes/admision/diplome');

/********************************/
/**group communication routers***/
/********************************/



/*********date base connection it will shut down every 5min you need to restart it*************************/
// var con = mysql.createConnection({
//   host: "remotemysql.com",
//   user: "5mrruYpkTT",
//   password: "MbMXb71BlA"
// });
con.connect(function(err) {
  if (err){
      console.log(err.message)
  }else{
    console.log("Connected!");
  };
  con.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      con.connect(function(err) {
        if (err){
          console.log(err.message)
        }else{
          console.log("Connected!");
        }             
      })
    } else {
      throw err;
    }
  });

});
 /***************************************/
  /*************cors handler**************/
  /***************************************/
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin,X-Requested-With,Content-Type,Accept,Authorization'
    )
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET')
      return res.status(200).json({})
    }
    next()
  })
  /**acces control */
  app.use(accesControl)
  app.use(express.urlencoded({extended: true}));  
  app.use(express.json())
  
  app.use('/uploads',express.static('./uploads'))
app.use(express.static('public'));
app.use('/demande-master', express.static('demande-master'));
app.use('/etablissement_logo', express.static('etablissement_logo'));

  app.use(morgan('dev'))
/****************use routes here******************/
/*************************************************/
  

/************************************/
/***use group evenementiel routers***/
/************************************/
app.use("/auth_event",auth_evenementiel_route_auth_event)
app.use("/demande_event",auth_evenementiel_route_demande_event)
app.use("/roles_and_teams",auth_evenementiel_route_roles_and_teams)
app.use("/user",auth_evenementiel_route_user)
app.use("/event",auth_evenementiel_route_evenment)
app.use("/club",auth_evenementiel_route_club)
app.use("/forgetpassword",auth_evenementiel_route_forgetpassword)
app.use("/sondage",auth_evenementiel_route_sondage)
app.use("/post",auth_evenementiel_route_post)
app.use("/calendar",auth_evenementiel_route_calendrier)
app.use("/participation",auth_evenementiel_route_participation)
app.use("/activites",auth_evenementiel_route_activites)
app.get('/resetpassword/:token',function(req,res){
  res.sendFile(path.join(__dirname+'/api/routes/evenementiel/resetpassword.html'));
});
/************************************/
/***use group stage pfe routers******/
/************************************/
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/entreprise',entrepriseRouter);
app.use('/offrestage',offreStageRouter);
app.use('/domaine',domaineeRouter);
app.use('/experience',experienceRouter);
app.use('/cv',cvRouter);
app.use('/demandeEtudiantStageEntreprise',demandeStageEtudiantRouter);
app.use('/demandeEntreprise',deamndeStageEntrepriseRouter);
app.use('/competence',competenceRouter);
app.use('/confirmationDemande',confirmationDemandeRouter);
app.use('/etudiantComp',etudiantComp);
app.use('/stagiaires',stagiaires);


/************************************/
/***use group scolarite routers******/
/************************************/
////////////File///////////////////
app.use("/addfile",File)
app.use("/updatefile",File)
app.use("/updatefile",File)
app.use("/DeleteFile",File)
app.use("/getEtudiant",File)
app.use("/getPapierRaison",File)
app.use("/getAllFile",File)
app.use("/getuser",File)

app.use("/getFileAccepter",File)
app.use("/getFileEnAttente",File)
app.use("/getFileRefuser",File)

app.use("/getPaperTypes",File)
app.use("/getAllNumber",File)
app.use("/getAllNumberA",File)
app.use("/getAllNumberE",File)
app.use("/getAllNumberR",File)
app.use("/getDocNbByMonth",File)

///////////Reclamation///////////////
app.use("/addReclamation",Reclamation)
app.use("/updateReclamation",Reclamation)
app.use("/DeleteReclamation",Reclamation)
app.use("/getReclamtion",Reclamation)
app.use("/getAllReclamtion",Reclamation)
app.use("/getByIdUser",Reclamation)
app.use("/getReclamtionById",Reclamation)
app.use("/updateReclamation",Reclamation)
app.use("/relancerReclamtion",Reclamation)

app.use("/getReclamtionAccepter",Reclamation)
app.use("/getReclamtionEnAttente",Reclamation)
app.use("/getReclamtionRefuser",Reclamation)
app.use("/getAllReclamTypes",Reclamation)
app.use("/getAllClass",Reclamation)
app.use("/getClassByIdEtudiant",Reclamation)
app.use("/getAllSpecialite",Reclamation)
app.use("/getNumberReclamation",Reclamation)
app.use("/getNumberReclamationA",Reclamation)
app.use("/getNumberReclamationE",Reclamation)
app.use("/getNumberReclamationR",Reclamation)
app.use("/getDates",Reclamation)
app.use("/getRecNbByMonth",Reclamation)


/**use group administration routers**/
/************************************/

/************************************/
/****use group admision routers******/
/************************************/
app.use('/admin', adminRouter);
app.use('/classe', classeRouter);
app.use('/demandeMaster', demandeMasterRouter);
app.use('/departement', departementRouter);
app.use('/domaine', domaineRouter);
app.use('/etablissement', etablissementRouter);
app.use('/etudiant', etudiantRouter);
app.use('/master', masterRouter);
app.use('/niveau', niveauRouter);
app.use('/responsableGroup', responsableGroupRouter);
app.use('/role', roleRouter);
app.use('/specialite', specialiteRouter);
app.use('/users', userRouter);
app.use('/situation', situationRouter);
app.use('/etatDemande', etatRouter);
app.use('/pays', paysRouter);
app.use('/ville', villeRouter); 
app.use('/gouvernerat', gouvernRouter);
app.use('/adminMaster', AdminMaster);
app.use('/diplome', diplomeRouter);
app.use('/cursus', cursusRouter);
app.use('/bacclaureat', bacRouter);
app.use('/cursusG', CursusGRouter);

/************************************/
/**use group communication routers***/
/************************************/
app.use(function(req, res, next) {
  // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Origin: *');
  res.header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers: Content-Type');
  next();
});


////////////////////////NOde mailer////////////////////////////
// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/hello', (req, res) => {
  res.json({ error: err })
});

app.post('/send/:emailfrom', (req, res) => {
  
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "imap.gmail.com",
    Port: 993,
    secure: true, // upgrade later with STARTTLS
    auth: {
      user: "ilyeshrizi60@gmail.com",
      pass: "zgfedrzlqtjgppfy",
    },
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"req.params.emailfrom"', // sender address
      to: req.body.mailto, // list of receivers
      subject: 'Confirmation', // Subject line
      text: 'hello email', // plain text body
      html: req.body.contenu // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      else{
        console.log('Message sent: ' + info.res);
        res.sendStatus(200);
    };
    return res.sendStatus(200);  
    
  });
  });


////////////////////////NOde mailer////////////////////////////
// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/hello', (req, res) => {
  res.json({ error: err })
});



app.post('/send/:emailfrom', (req, res) => {
  
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "imap.gmail.com",
    Port: 993,
    secure: true, // upgrade later with STARTTLS
    auth: {
      user: "ilyeshrizi60@gmail.com",
      pass: "zgfedrzlqtjgppfy",
    },
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"req.params.emailfrom"', // sender address
      to: req.body.mailto, // list of receivers
      subject: 'Confirmation', // Subject line
      text: 'hello email', // plain text body
      html: req.body.contenu // html body
  };

/************************************/
/***use group Absence et Présence******/
/************************************/
app.use('/absencepresence',AbPr)

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin: *');
  res.header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers: Content-Type');
  next();
});

////////////////////////NOde mailer////////////////////////////
// Body Parser Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.get('/hello', (req, res) => {
  res.json({ error: err })
});

app.post('/send/:emailfrom', (req, res) => {
  
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "imap.gmail.com",
    Port: 993,
    secure: true, // upgrade later with STARTTLS
    auth: {
      user: "ilyeshrizi60@gmail.com",
      pass: "zgfedrzlqtjgppfy",
    },
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"req.params.emailfrom"', // sender address
      to: req.body.mailto, // list of receivers
      subject: 'Confirmation', // Subject line
      text: 'hello email', // plain text body
      html: req.body.contenu // html body
  };


  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      else{
        console.log('Message sent: ' + info.res);
        res.sendStatus(200);
    };
    return res.sendStatus(200);  
    
  });
  });



//////////////////////////////////////////////////////////////
  //if api not found will return 
  app.use((req, res) => {
    res.status(404).json({ error: 'api not found' })
  })
});

module.exports = app

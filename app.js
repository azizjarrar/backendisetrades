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

/********************************/
/**group communication routers***/
/********************************/



/*********date base connection it will shut down every 5min you need to restart it*************************/
  client.connect(function(err) {
    if (err){
        console.log(err.message)
    }else{
      console.log("Connected!");
    };
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
  app.use(express.urlencoded({extended: true}));  
  app.use(express.json())
  
  app.use('/uploads',express.static('./uploads'))


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

/************************************/
/***use group communication routers**/
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



//////////////////////////////////////////////////////////////
  //if api not found will return 
  app.use((req, res) => {
    res.status(404).json({ error: 'api not found' })
  })


module.exports = app

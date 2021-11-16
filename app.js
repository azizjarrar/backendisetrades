const express = require('express')
const morgan = require('morgan')
const app = express()
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const id_Server = "192.168.118.228";

var mysql = require('mysql');
dotenv.config();
/******************************************************/
/***************import routes here*********************/
/*******************************************************/

/********************************/
/***group evenementiel routers***/
/********************************/
const auth_evenementiel_route_auth_event= require('./api/routes/evenementiel/auth')
/********************************/
/***group stage pfe routers******/
/********************************/

/********************************/
/***group scolarite routers******/
/********************************/
/////////////File ////////////////////////
const add_file= require('./api/routes/scolarite/AddFile')
const update_file= require('./api/routes/scolarite/AddFile')
const update_file2= require('./api/routes/scolarite/AddFile')
const deletefile= require('./api/routes/scolarite/AddFile')
const { getById,getAllPaperTypes } = require('./api/controllers/scolarite/AddFile');
const { getPapierNonRaison } = require('./api/controllers/scolarite/AddFile');
const { getAll } = require('./api/controllers/scolarite/AddFile');
const getByIdUser  = require('./api/routes/scolarite/AddFile');

const getAccepter  = require('./api/routes/scolarite/AddFile');
const getEnAttente  = require('./api/routes/scolarite/AddFile');
const getRefuser  = require('./api/routes/scolarite/AddFile');
const getAllNumber = require('./api/routes/scolarite/AddFile')
const getAllNumberA = require('./api/routes/scolarite/AddFile')
const getAllNumberE = require('./api/routes/scolarite/AddFile')
const getAllNumberR = require('./api/routes/scolarite/AddFile')
/////////////reclamation////////////////
const add_Reclamation= require('./api/routes/scolarite/Reclamation')
const update_Reclamation= require('./api/routes/scolarite/Reclamation')
const delete_Reclamation= require('./api/routes/scolarite/Reclamation');
const get_Reclamation = require('./api/routes/scolarite/Reclamation')
const { getAllReclamation}= require('./api/controllers/scolarite/Reclamation')
const getReclamationByIdUser = require('./api/routes/scolarite/Reclamation')
const getReclamationById = require('./api/routes/scolarite/Reclamation')
const getRecAccepter  = require('./api/routes/scolarite/Reclamation');
const getRecEnAttente  = require('./api/routes/scolarite/Reclamation');
const getRecRefuser  = require('./api/routes/scolarite/Reclamation');
const update_Reclamation2= require('./api/routes/scolarite/Reclamation')
const getAllReclamTypes= require('./api/routes/scolarite/Reclamation')
const relancerReclamtion= require('./api/routes/scolarite/Reclamation')
const getNumberReclamation = require('./api/routes/scolarite/Reclamation')
const getNumberReclamationA = require('./api/routes/scolarite/Reclamation')
const getNumberReclamationE = require('./api/routes/scolarite/Reclamation')
const getNumberReclamationR = require('./api/routes/scolarite/Reclamation')
const getDates = require('./api/routes/scolarite/Reclamation')
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
app.use("/addfile",add_file)
app.use("/updatefile",update_file)
app.use("/updatefile",update_file2)
app.use("/DeleteFile",deletefile)
app.use("/getEtudiant",getById)
app.use("/getPapierRaison",getPapierNonRaison)
app.use("/getAllFile",getAll)
app.use("/getuser",getByIdUser)

app.use("/getFileAccepter",getAccepter)
app.use("/getFileEnAttente",getEnAttente)
app.use("/getFileRefuser",getRefuser)

app.use("/getPaperTypes",getAllPaperTypes)
app.use("/getAllNumber",getAllNumber)
app.use("/getAllNumberA",getAllNumberA)
app.use("/getAllNumberE",getAllNumberE)
app.use("/getAllNumberR",getAllNumberR)
///////////Reclamation///////////////
app.use("/addReclamation",add_Reclamation)
app.use("/updateReclamation",update_Reclamation)
app.use("/DeleteReclamation",delete_Reclamation)
app.use("/getReclamtion",get_Reclamation)
app.use("/getAllReclamtion",getAllReclamation)
app.use("/getByIdUser",getReclamationByIdUser)
app.use("/getReclamtionById",getReclamationById)
app.use("/updateReclamation",update_Reclamation2)
app.use("/relancerReclamtion",relancerReclamtion)

app.use("/getReclamtionAccepter",getRecAccepter)
app.use("/getReclamtionEnAttente",getRecEnAttente)
app.use("/getReclamtionRefuser",getRecRefuser)
app.use("/getAllReclamTypes",getAllReclamTypes)
app.use("/getAllClass",getAllClass)
app.use("/getClassByIdEtudiant",getClassByIdEtudiant)
app.use("/getAllSpecialite",getAllSpecialite)
app.use("/getNumberReclamation",getNumberReclamation)
app.use("/getNumberReclamationA",getNumberReclamationA)
app.use("/getNumberReclamationE",getNumberReclamationE)
app.use("/getNumberReclamationR",getNumberReclamationR)
app.use("/getDates",getDates)
/**use group administration routers**/
/************************************/

/************************************/
/****use group admision routers******/
/************************************/

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



//////////////////////////////////////////////////////////////
  //if api not found will return 
  app.use((req, res) => {
    res.status(404).json({ error: 'api not found' })
  })
});

module.exports = app

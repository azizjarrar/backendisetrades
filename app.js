const express = require('express')
const morgan = require('morgan')
const app = express()
const dotenv = require('dotenv');
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
const deletefile= require('./api/routes/scolarite/AddFile')
const getEtudiantById= require('./api/routes/scolarite/AddFile')

/////////////reclamation////////////////
const add_Reclamation= require('./api/routes/scolarite/Reclamation')
const update_Reclamation= require('./api/routes/scolarite/Reclamation')
const delete_Reclamation= require('./api/routes/scolarite/Reclamation');
const { getById } = require('./api/controllers/scolarite/AddFile');
const { get } = require('./api/routes/scolarite/AddFile');
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
var con = mysql.createConnection({
  host: "remotemysql.com",
  user: "5mrruYpkTT",
  password: "MbMXb71BlA"
});
con.connect(function(err) {
  if (err){
      console.log(err.message)
  }else{
    console.log("Connected!");
  };
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
  app.use(morgan('dev'))
/*************************************************/
/****************use routes here******************/
/*************************************************/
  

/************************************/
/***use group evenementiel routers***/
/************************************/
  app.use("/auth_event",auth_evenementiel_route_auth_event)
/************************************/
/***use group stage pfe routers******/
/************************************/

/************************************/
/***use group scolarite routers******/
/************************************/
////////////File///////////////////
app.use("/addfile",add_file)
app.use("/updatefile",update_file)
app.use("/DeleteFile",deletefile)
app.use("/getEtudiant",getEtudiantById)
///////////Reclamation///////////////
app.use("/addReclamation",add_Reclamation)
app.use("/updateReclamation",update_Reclamation)
app.use("/DeleteReclamation",delete_Reclamation)
/************************************/
/**use group administration routers**/
/************************************/

/************************************/
/****use group admision routers******/
/************************************/

/************************************/
/**use group communication routers***/
/************************************/




  //if api not found will return 
  app.use((req, res) => {
    res.status(404).json({ error: 'api not found' })
  })
});

module.exports = app

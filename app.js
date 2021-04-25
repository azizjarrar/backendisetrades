const express = require('express')
const morgan = require('morgan')
const app = express()
const dotenv = require('dotenv');
dotenv.config();
var client = require('./db_connection');

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
const add_file= require('./api/routes/scolarite/AddFile')
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
app.use("/addfile",add_file)
/************************************/
/**use group administration routers**/
/************************************/

/************************************/
/****use group admision routers******/
/************************************/

/************************************/
/***use group communication routers**/
/************************************/




  //if api not found will return 
  app.use((req, res) => {
    res.status(404).json({ error: 'api not found' })
  })


module.exports = app

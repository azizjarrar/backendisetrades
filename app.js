const express = require('express')
const morgan = require('morgan')
const app = express()
const dotenv = require('dotenv');
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

/********************************/
/***group stage pfe routers******/
/********************************/

/********************************/
/***group scolarite routers******/
/********************************/

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
/*************************************************/
/****************use routes here******************/
/*************************************************/
  

/************************************/
/***use group evenementiel routers***/
/************************************/
  app.use("/auth_event",auth_evenementiel_route_auth_event)
  app.use("/demande_event",auth_evenementiel_route_demande_event)
  app.use("/roles_and_teams",auth_evenementiel_route_roles_and_teams)
  app.use("/user",auth_evenementiel_route_user)
  app.use("/club",auth_evenementiel_route_club)
  app.use("/forgetpassword",auth_evenementiel_route_forgetpassword)
  app.use("/sondage",auth_evenementiel_route_sondage)
  app.use("/post",auth_evenementiel_route_post)
  app.get('/resetpassword/:token',function(req,res){
    res.sendFile(path.join(__dirname+'/api/routes/evenementiel/resetpassword.html'));
  });
  
/************************************/
/***use group stage pfe routers******/
/************************************/

/************************************/
/***use group scolarite routers******/
/************************************/

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

const express = require('express')
const app = express()
const morgan = require('morgan')
const dotenv = require('dotenv');
var mysql = require('mysql');
dotenv.config();
/*************import routes*****************/
const auth_evenementiel_route_auth_event= require('./api/routes/evenementiel/auth')
/*******************************************/
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
  app.use(express.urlencoded({extended: true}));  
  app.use(express.json())
  app.use(morgan('dev'))
  /****************use routes here******************/
  app.use("auth_event",auth_evenementiel_route_auth_event)


  //if api not found will return 
  app.use((req, res) => {
    res.status(404).json({ error: 'api not found' })
  })
});

module.exports = app

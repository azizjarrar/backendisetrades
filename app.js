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
const add_file= require('./api/routes/scolarite/AddFile')
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

const cursusRouter = require('./api/routes/admision/cursus');
const bacRouter = require('./api/routes/admision/bacclaureat');
const CursusGRouter = require('./api/routes/admision/cursusG');
const diplomeRouter = require('./api/routes/admision/diplome');

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
app.use(express.static('public'));
app.use('/demande-master', express.static('demande-master'));
app.use('/etablissement_logo', express.static('etablissement_logo'));

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
/***use group communication routers**/
/************************************/




  //if api not found will return 
  app.use((req, res) => {
    res.status(404).json({ error: 'api not found' })
  })


module.exports = app

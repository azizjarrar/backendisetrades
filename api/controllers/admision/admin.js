"use strict";
const connexion = require('../../../db_connection');
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
require("dotenv").config();


module.exports.getAdmin = (req, res) => {
  const id_user = req.params.id;
  connexion.query(
    'select * from user, adresse, situation_professionnel, pays, ville,gouvernerat where user.id_user = adresse.id_user and adresse.pays = pays.id_pays and adresse.ville =ville.id_ville and adresse.gouvernorat_adresse = gouvernerat.id_gouvernerat and user.id_situation_professionnel= situation_professionnel.id_situation_professionnel and user.id_role = 4',
    [id_user],
    (err, results) => {
      if (err) {
        res.status(500).json({
          err: true,
          results: []
        });
        return;
      }

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
        });return;}
    })
};

module.exports.updateAdmin = (req, res) => {
  const data = req.body;
  const salt = bcrypt.genSaltSync(10);
  console.log(req)
  data.password = bcrypt.hashSync(data.password, salt);
  connexion.query(
    'Update user set email = ?, password = ?, id_role = 4, nom = ?, prenom = ?, age = ?, cin = ?, sexe = ?, num_passport = ?, date_naissance = ? where id_user = ?',
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

module.exports.getAdminByEmail = (req, res) => {
  const body = req.body;
  connexion.query(
    'select * from user where email = ? and id_role=4',
    [body.email],
    (err, results) => {
      if (err) {
        res.status(500).json({
          err: true,
          results: []
        });
        return;
      }

      if (results.length > 0) {
        const result = bcrypt.compareSync(body.password, results[0].password);
        console.log(result)
        if (result) {
          results.password = undefined;
          const jsontoken = sign({ result: results }, process.env.JWT_KEY, {
          });

          res.status(200).json({
            err: false,
            message: "login successfully",
            token: jsontoken,
            id_user: results[0].id_user
          });
          return;
        } else {
          res.status(404).json({
            err: false,
            message: "Invalidpassword",
          });
          return;
        }

      } else {
        res.status(404).json({
          err: false,
          message: "User with this mail does not exist",
        });
        return;
      }
    })
};



var client = require('../../../db_connection')
var jwt = require('jsonwebtoken');
const crypto = require("crypto");
var nodemailer = require('nodemailer');
const validator = require('../../middleware/validator')
/**************************************************************************/
/**************this part is responsible for forgeting password*************/
/**************************************************************************/
exports.sendEmailForgetPassword=(req,res)=>{
  if (validator(req.body, ["email"], res)) {
    return
  }
    client.query(`SELECT *  FROM  membre WHERE email='${req.body.email}';`,async (err,result)=>{
        if (err){
            res.status(res.statusCode).json({
                errorCode: err.message,
                status: res.statusCode,
              });
        }else{
            if(result.length==0){
                res.status(res.statusCode).json({
                    message: "user not found",
                  });
            }else{
               

               const token  =await jwt.sign({email:req.body.email},process.env.secret_key_token_auth_event,{ expiresIn: '1h' })
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                          user: 'clubcelva89@gmail.com',
                          pass: 'Celva123'
                        }
                      });
                        var mailOptions = {
                          from: 'isetrades@gmail.com',
                          to: req.body.email,
                          subject: 'result',
                          text: "http://127.0.0.1:5010/resetpassword/"+"token="+token
                        };
                      transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                          console.log(error);
                        } else {
                          console.log('Email sent: ' + info.response);
                        }
                      });
                        res.status(res.statusCode).json({
                            message: "we sent email ",
                          });
                


   
            }

        }
    })
}
exports.restartPassword=(req,res)=>{
  if (validator(req.body, ["password"], res)) {
    return
  }
    try{
        const decoded = jwt.verify(req.body.token, process.env.secret_key_token_auth_event)
        client.query(`UPDATE membre  SET motdepasse='${req.body.password}'  WHERE email='${decoded.email}'`,async (err,result)=>{
            if (err){
                res.status(res.statusCode).json({
                    errorCode: err.message,
                    status: res.statusCode,
                  });
            }else{
                res.status(res.statusCode).json({
                    message: "password was changed",
                    status: res.statusCode,
                  });
            }
        })
    }catch(error) {
        res.status(403).json({
            errorMessage:error.message,
            state: false,
            message: "token in invalide",
        })
    }


}
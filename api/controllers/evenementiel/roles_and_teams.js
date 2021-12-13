var client = require('../../../db_connection')
const responseSender = require("../../middleware/responseSender")

/**************************************************************************/
/**********this part is responsible for getting teams and roles ***********/
/**************************************************************************/

exports.getroles = (req, res) => {
    client.query(`SELECT *  FROM  role_membre ;`, (err, result) => {
        if (err) {
            responseSender(res, { error: true, errorMessage: err.message })
        } else {
            responseSender(res,{data: result})
        }
    })
}
exports.getTeams = (req, res) => {
    client.query(`SELECT *  FROM equipes ;`, (err, result) => {
        if (err) {
            responseSender(res, { error: true, errorMessage: err.message })
        } else {
            responseSender(res,{data: result})
        }
    })
}
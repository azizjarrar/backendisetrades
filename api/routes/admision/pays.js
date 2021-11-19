const express = require("express");
const router = express.Router();
const paysController = require('../../controllers/admision/pays')

router.get("/", paysController.getListPays);


module.exports = router;
 
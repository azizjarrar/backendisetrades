const express = require("express");
const router = express.Router();
const villeController = require('../../controllers/admision/ville')

router.get("/", villeController.getListville);


module.exports = router;
 
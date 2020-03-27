var express = require('express');
var router = express.Router();
var HandlerGenerator = require("../Autentication/HandlerGenerator.js");

HandlerGenerator = new HandlerGenerator();


/**
 * LOG IN
 */
router.post("/login", HandlerGenerator.login);

/**
 * REGISTER
 */
router.post("/", HandlerGenerator.registro);

module.exports = router;

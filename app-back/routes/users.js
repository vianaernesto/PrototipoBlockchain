var express = require('express');
var router = express.Router();
const ObjectId =require("mongodb").ObjectID;
const {Connection} = require("../db/Mongolib");
const middleware = require("../Autentication/middleware");
var HandlerGenerator = require("../Autentication/HandlerGenerator.js");

HandlerGenerator = new HandlerGenerator();

const db = "prototipo";
const collection = "users";

/**
 * LOG IN
 */
router.post("/login", HandlerGenerator.login);

/**
 * REGISTER
 */
router.post("/", HandlerGenerator.registro);

module.exports = router;

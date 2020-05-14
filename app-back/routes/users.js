var express = require('express');
var router = express.Router();
var HandlerGenerator = require("../Autentication/HandlerGenerator.js");
let {Connection} = require('../db/Mongolib');

HandlerGenerator = new HandlerGenerator();


/**
 * LOG IN
 */
router.post("/login", HandlerGenerator.login);

/**
 * REGISTER
 */
router.post("/", HandlerGenerator.registro);


router.get("/:id", (req, res) => {
    Connection.connectToMongo().then(async database => {
        const client = database.db('prototipo').collection('users');

        await client
        .find({cedula: parseInt(req.params.id)})
        .toArray()
        .then(response => res.status(200).json(response[0]))
        .catch(err => res.status(404).json({message: err.message}));
    }).catch(error =>{console.log(error)});
});

module.exports = router;
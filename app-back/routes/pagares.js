var express = require('express');
var router = express.Router();
const ObjectId =require("mongodb").ObjectID;
const {Connection} = require("../db/Mongolib");

const db = "prototipo";
const collection = "pagares"

/**
 *  GET Transaction
 */

router.post("/crear", (req, res) =>{
    const newPagare = {
        nombreDeudor: req.body.nombreDeudor,
        firmaDeudor: req.body.firmaDeudor,
        monto : req.body.monto,
        cedulaDeudor: req.body.cedulaDeudor,
        nombreAcreedor : req.body.nombreAcreedor,
        cedulaAcreedor: req.body.cedulaAcreedor,
        fechaDeCreacion : req.body.value,
        lugarDeCreacion: req.body.lugarDeCreacion,
        lugarDeCumplimiento : req.body.lugarDeCumplimiento
    };

    try {
        Connection.connectToMongo()
            .then(database =>{
                const client = database.db(db).collection(collection);

                client.insertOne(newPagare, (err, result) =>{
                    if(err){
                        res.status(400).json({message: err.message});
                        return;
                    }
                    res.status(201).send(result.ops);
                });
            })
            .catch(err =>{
                res.status(500).json({message :err.message});
            });

    }catch(err){
        res.status(500).json({message: err.message});
    }

});

module.exports = router;
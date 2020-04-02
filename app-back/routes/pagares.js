var express = require('express');
var router = express.Router();
const ObjectId =require("mongodb").ObjectID;
const {Connection} = require("../db/Mongolib");
const axios = require('axios');

const db = "prototipo";
const collection = "pagares"

/**
 *  GET Info Pagaré
 */

router.get("/:id", (req,res) =>{

    try{
        Connection.connectToMongo()
            .then(database => {
                const client = database.db(db).collection(collection);

                client
                    .find({_id: ObjectId(req.params.id)})
                    .toArray()
                    .then(x => res.status(200).json(x))
                    .catch(err => res.status(404).json({message: err.message}));
            })
            .catch(err =>{
                res.status(500).json({message:err.message});
            });
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

/**
 *  GET Pagarés acreedor
 * 
 */
router.get("/acreedor/:id", (req,res) =>{

    try{
        Connection.connectToMongo()
            .then(database => {
                const client = database.db(db).collection(collection);

                client
                    .find({idAcreedor:parseInt(req.params.id)})
                    .toArray()
                    .then(x => res.status(200).json(x))
                    .catch(err => res.status(404).json({message: err.message}));
            })
            .catch(err =>{
                res.status(500).json({message:err.message});
            });
    }catch(err){
        res.status(500).json({message: err.message});
    }
});



 
/**
 *  GET Pagarés Deudor
 * 
 */

router.get("/deudor/:id", (req,res) =>{

    try{
        Connection.connectToMongo()
            .then(database => {
                const client = database.db(db).collection(collection);
                client
                    .find({idDeudor :parseInt(req.params.id)})
                    .toArray()
                    .then(x =>
                        {
                            
                            res.status(200).json(x)
                        } )
                    .catch(err => res.status(404).json({message: err.message}));
            })
            .catch(err =>{
                res.status(500).json({message:err.message});
            });
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

/**
 * Primera Etapa
 */

router.post("/etapa1", (req, res) =>{
    const newPagare = {
        valor : -1,
        nombreDeudor: req.body.nombreDeudor,
        idDeudor : req.body.idDeudor,
        nombreAcreedor: req.body.nombreAcreedor,
        idAcreedor : req.body.idAcreedor,
        fechaCreacion: null,
        lugarCreacion : "",
        fechaVencimiento : null,
        fechaExpiracion : null,
        lugarCumplimiento : "",
        firma : null,
        ultimoEndoso : null,
        pendiente: true,
        etapa : 1,
        terminos : "",
        codigoRetiro: "",
        confirmacionRetiro: "",
        hash_transaccion : "",
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


/**
 * Segunda Etapa
 */

router.patch("/:id/etapa2", (req, res) =>{

    let update = {
        etapa : 2,
        terminos : req.body.terminos,
        valor : req.body.valor,
        
    };

    try{
        Connection.connectToMongo()
        .then(database =>{
            const client = database.db(db).collection(collection);

            client.findOneAndUpdate(
                { _id: ObjectId(req.params.id)},
                { $set : update},
                {returnOriginal : false},
                (err, result) =>{
                    if(err){
                        res.status(400).json({message : err.message});
                        return;
                    }
                    res.status(200).json(result.value);
                }
            );
        })
        .catch(err =>{
            res.status(500).json({message : err.message});
        });
    }catch(err){
        res.status(500).json({ErrorConexion: err.message})
    }

});

/**
 * Tercera Etapa
 */

router.patch("/:id/etapa3", (req, res) =>{

   
    let update = {
        etapa : 3,
        lugarCreacion : req.body.lugarCreacion,
        fechaVencimiento : getFecha(req.body.fechaVencimiento),
        codigoRetiro : req.body.codigoRetiro,
    };

    try{
        Connection.connectToMongo()
        .then(database =>{
            const client = database.db(db).collection(collection);

            client.findOneAndUpdate(
                { _id: ObjectId(req.params.id)},
                { $set : update},
                {returnOriginal : false},
                (err, result) =>{
                    if(err){
                        res.status(400).json({message : err.message});
                        return;
                    }
                    res.status(200).json(result.value);
                }
            );
        })
        .catch(err =>{
            res.status(500).json({message : err.message});
        });
    }catch(err){
        res.status(500).json({ErrorConexion: err.message})
    }

});

/**
 * Cuarta Etapa
 */

router.patch("/:id/etapa4", (req, res) =>{

    let update = {
        etapa : 4,
        fechaCreacion : getFecha(req.body.fechaCreacion),
        fechaExpiracion : getFecha(req.body.fechaExpiracion) ,
        firma: req.body.firma, 
    };

    try{
        Connection.connectToMongo()
        .then(database =>{
            const client = database.db(db).collection(collection);

            client.findOneAndUpdate(
                { _id: ObjectId(req.params.id)},
                { $set : update},
                {returnOriginal : false},
                (err, result) =>{
                    if(err){
                        res.status(400).json({message : err.message});
                        return;
                    }
                    res.status(200).json(result.value);
                }
            );
        })
        .catch(err =>{
            res.status(500).json({message : err.message});
        });
    }catch(err){
        res.status(500).json({ErrorConexion: err.message})
    }

});

/**
 * Quinta Etapa
 */

router.patch("/:id/etapa5", (req, res) =>{

    let update = {
        etapa : 5,
        confirmacionRetiro : req.body.confirmacionRetiro,
    };

    try{
        Connection.connectToMongo()
        .then(database =>{
            const client = database.db(db).collection(collection);

            client.findOneAndUpdate(
                { _id: ObjectId(req.params.id)},
                { $set : update},
                {returnOriginal : false},
                (err, result) =>{
                    if(err){
                        res.status(400).json({message : err.message});
                        return;
                    }
                    res.status(200).json(result.value);
                }
            );
        })
        .catch(err =>{
            res.status(500).json({message : err.message});
        });
    }catch(err){
        res.status(500).json({ErrorConexion: err.message})
    }

});

let getFecha = (fecha) =>{

    let fechaSplit = fecha.split("-");

    let day = parseInt(fechaSplit[0]);

    let month = parseInt(fechaSplit[1]) -1;

    let year = parseInt(fechaSplit[2]);

    let fechaDate = new Date(year, month,day);

    return fechaDate;

}

module.exports = router;
var express = require('express');
var router = express.Router();
const ObjectId =require("mongodb").ObjectID;
const {Connection} = require("../db/Mongolib");

const db = "prototipo";
const collection = "transactions"

/**
 *  GET Transaction
 */

router.get("/:id", (req, res) =>{
    try{
        Connection.connectToMongo()
            .then(database => {
                const client = database.db(db).collection(collection);

                client
                  .find({_id: ObjectId(req.params.id)})
                  .toArray()
                  .then(x =>res.status(200).json(x))
                  .catch(err => res.status(404).json({message: err.message}));
            })
            .catch(err => {
                res.status(500).json({message: err.message});
            });
    } catch(err){
        res.status(500).json({message: err.message});
    }
});

module.exports = router;
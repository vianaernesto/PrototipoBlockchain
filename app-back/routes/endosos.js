var express = require('express');
var router = express.Router();
const axios = require('axios');

const ip = 'http://127.0.0.1';
const port = '5000';

/**
 * GET Info Endoso
 */

router.get("/:id",(req,res) =>{
    axios.get(`${ip}:${port}/endosos/${req.params.id}`)
        .then(response =>{
            res.status(200).json(response.data);
        })
        .catch(err =>{
            res.status(404).json({message:err.message});
        });
});

/**
* GET Endosos de un Pagaré
*/

router.get("/:id/endosos", (req,res)=>{
    axios.get(`${ip}:${port}/pagares/${req.params.id}/endosos`)
        .then(response =>{
            res.status(200).json(response.data);
        })
        .catch(err =>{
            res.status(404).json({message:err.message});
        })
})

module.exports = router;
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

router.get("/pagare/:id", (req,res)=>{
    axios.get(`${ip}:${port}/pagares/${req.params.id}/endosos`)
        .then(response =>{
            res.status(200).json(response.data);
        })
        .catch(err =>{
            res.status(404).json({message:err.message});
        })
})

/**
 * POST endoso en etapa 1
 */
router.post("/pagare/:id/etapa1", (req, res) =>{
     const newEndoso = {
         id_endosante : req.body.id_endosante,
         id_endosatario : req.body.id_endosatario,
         nombre_endosante : req.body.nombre_endosante,
         nombre_endosatario : req.body.nombre_endosatario
     }

     axios.post(
         `${ip}:${port}/pagares/${req.params.id}/endosos/etapa1`,
         newEndoso,
         {
             headers:{
                 'Content-Type' : 'application/json'
             }
         }
     ).then(response =>{
         res.status(200).send(response.data);
     })
     .catch(err =>{
         if(err.response.status === 401){
             res.status(401).json(err.data);
         }else{
            res.status(500).json({message: err});
         }
         
     });
});

/**
 * POST Endoso etapa 2
 */
router.post("/pagare/:id/etapa2", (req, res) =>{
    const newEndoso = {
        codigo_retiro : req.body.codigo_retiro,
    }
    axios.post(
        `${ip}:${port}/pagares/${req.params.id}/endosos/etapa2`,
        newEndoso,
        {
            headers:{
                'Content-Type' : 'application/json'
            }
        }
    ).then(response =>{
        res.status(201).send(response.data);
    })
    .catch(err =>{
        res.status(401).json({message: err.message});
    });
});

/**
* POST Endoso etapa 3
*/
router.post("/pagare/:id/etapa3", (req, res) =>{
    const newEndoso = {
        firma : req.body.firma,
    }
    axios.post(
        `${ip}:${port}/pagares/${req.params.id}/endosos/etapa3`,
        newEndoso,
        {
            headers:{
                'Content-Type' : 'application/json'
            }
        }
    ).then(response =>{
        res.status(201).send(response.data);
    })
    .catch(err =>{
        res.status(500).json({message: err.message});
    });
});


/**
 * GET Endoso dado un endosante
 */
router.get("/endosante/:id/", (req,res)=>{
    axios.get(`${ip}:${port}/endosos/endosante/${req.params.id}`)
        .then(response =>{
            res.status(200).json(response.data);
        })
        .catch(err =>{
            res.status(404).json({message:err.message});
        })
});


/**
* GET Endoso dado un endosatario
*/
router.get("/endosatario/:id/", (req,res)=>{
    axios.get(`${ip}:${port}/endosos/endosatario/${req.params.id}`)
        .then(response =>{
            res.status(200).json(response.data);
        })
        .catch(err =>{
            res.status(404).json({message:err.message});
        })
});


module.exports = router;
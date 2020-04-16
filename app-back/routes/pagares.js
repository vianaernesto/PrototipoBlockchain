var express = require('express');
var router = express.Router();
const axios = require('axios');


const ip = 'http://127.0.0.1';
const port = '5000';

/**
 *  GET Info Pagaré
 */

router.get("/:id", (req,res) =>{

    axios.get(`${ip}:${port}/pagares/${req.params.id}`)
        .then(response =>{
            res.status(200).json(response.data);
        })
        .catch(err =>{
            res.status(404).json({message: err.message});
        });

});

/**
 *  GET Pagarés acreedor
 * 
 */
router.get("/acreedor/:id", (req,res) =>{

    axios.get(`${ip}:${port}/pagares/acreedor/${req.params.id}`)
    .then(response =>{
        res.status(200).json(response.data);
    })
    .catch(err =>{
        res.status(404).json({message: err.message});
    });
    
});



 
/**
 *  GET Pagarés Deudor
 * 
 */

router.get("/deudor/:id", (req,res) =>{

    axios.get(`${ip}:${port}/pagares/deudor/${req.params.id}`)
    .then(response =>{
        res.status(200).json(response.data);
    })
    .catch(err =>{
        res.status(404).json({message: err.message});
    });
});

/**
 * Primera Etapa
 */

router.post("/etapa1", (req, res) =>{
    const newPagare = {
        nombreDeudor: req.body.nombreDeudor,
        idDeudor : req.body.idDeudor,
        nombreAcreedor: req.body.nombreAcreedor,
        idAcreedor : req.body.idAcreedor,
    };

    axios.post(
        `${ip}:${port}/pagares/etapa1`,
         newPagare,
         {
            headers: {
                'Content-Type': 'application/json'
                }
            }
        ).then(response =>{
            res.status(201).send(response.data);
        })
        .catch(err => {
            res.status(500).json({message: err.message});
        });

});


/**
 * Segunda Etapa
 */

router.patch("/:id/etapa2", (req, res) =>{

    let update = {
        etapa : 1.5,
        terminos : req.body.terminos,
        valor : req.body.valor,
        deudorAcepta : false,
        acreedorAcepta: false,
    };

    if(req.body.idAceptador === req.body.idDeudor){
        update.deudorAcepta = true;
    } else{
        update.acreedorAcepta = true;
    }
    

    axios.put(
        `${ip}:${port}/pagares/${req.params.id}/etapa2`,
        update,
        {
            headers: {
                'Content-Type': 'application/json'
                }
            }
        ).then(response =>{
            let data = response.data;
            data.etapa = 1.5;
            res.status(201).send(data);
        })
        .catch(err => {
            res.status(500).json({message: err.message});
        });

});

/**
 * Segunda Etapa Aceptar
 */

router.patch("/:id/etapa2/aceptar", (req, res) =>{

    let update = {
        deudorAcepta : true, 
        acreedorAcepta : true, 
    };

    axios.put(
        `${ip}:${port}/pagares/${req.params.id}/etapa2/aceptar`,
        update,
        {
            headers: {
                'Content-Type': 'application/json'
                }
            }
        ).then(response =>{
            let data = response.data;
            res.status(201).send(data);
        })
        .catch(err => {
            res.status(500).json({message: err.message});
        });

});

/**
 * Tercera Etapa
 */

router.patch("/:id/etapa3", (req, res) =>{

   
    let update = {
        etapa : 3,
        lugarCreacion : req.body.lugarCreacion,
        fechaVencimiento : req.body.fechaVencimiento,
        codigoRetiro : req.body.codigoRetiro,
    };

    axios.put(
        `${ip}:${port}/pagares/${req.params.id}/etapa3`,
        update,
        {
            headers: {
                'Content-Type': 'application/json'
                }
            }
        ).then(response =>{
            let data = response.data;
            res.status(201).send(data);
        })
        .catch(err => {
            res.status(500).json({message: err.message});
        });

});

/**
 * Cuarta Etapa
 */

router.patch("/:id/etapa4", (req, res) =>{

    let update = {
        firma: req.body.firma, 
    };

    axios.put(
        `${ip}:${port}/pagares/${req.params.id}/etapa4`,
        update,
        {
            headers: {
                'Content-Type': 'application/json'
                }
            }
        ).then(response =>{
            let data = response.data;
            res.status(201).send(data);
        })
        .catch(err => {
            res.status(500).json({message: err.message});
        });

});



module.exports = router;
const crypto = require('crypto');
const config = require('../Autentication/config.js');
const { Connection } = require("../db/Mongolib");


module.exports = {
    encriptar: (data) => {
        const hasher = crypto.createHash('sha256');
        const plusSalt = data + config.salt;
        hasher.update(plusSalt);
        return hasher.digest('hex');
    },
    verificarUsuario: (cedula, contrasenia) => {
        return new Promise((resolve,reject) =>{
            Connection.connectToMongo().then(client =>{
                client.db("prototipo").collection(config.USUARIOS).findOne({
                    cedula: cedula, contrasenia: contrasenia},
                    (err, document) => {
                        if(err) reject(err);
                        else if (!document) resolve(document);
                        else resolve(document);
                    })
            });
        });
    }
};
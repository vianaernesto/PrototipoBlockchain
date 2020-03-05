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
    verificarUsuario: (username, password) => {
        return new Promise((resolve,reject) =>{
            Connection.connectToMongo().then(client =>{
                client.db().collection(config.USUARIOS).findOne({
                    usuario: username, contrasenia: password},
                    (err, document) => {
                        if(err) reject(err);
                        else if (!document) resolve(document);
                        else resolve(document);
                    })
            });
        });
    }
};
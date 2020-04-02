let jwt = require('jsonwebtoken');
let config = require('./config.js');
let security = require('./security');

let conn = require('./usersDBConn');

class HandlerGenerator {

    login(req,res) {

        let cedula = req.body.cedula;
        let contrasenia = req.body.contrasenia;

        if(cedula && contrasenia) {

            contrasenia = security.encriptar(contrasenia);

            security.verificarUsuario(cedula,contrasenia)
                .then(doc =>{    
                    if(!doc){
                        res.status(200).json({
                            success: false,
                            message: 'Cedula o contraseña incorrecta'
                        });
                    } 
                    else {
                        
                        let token = jwt.sign({ cedula: doc.cedula, nombres: doc.nombres, apellidos : doc.apellidos, correo: doc.correo, _id: doc._id},
                            config.secret, { expiresIn: '2h'});

                            res.status(200).json({
                                success: true,
                                message: 'Successfully added token to user',
                                token: token,
                                nombre: `${doc.nombres} ${doc.apellidos}`,
                            });
                    }
                })
                .catch(err => {
                    res.status(200).json({
                        success: false,
                        message: `Authentication failed! There was an error during the process: ${err}`
                    });
                });
        } else{
            res.status(200).json({
                success: false,
                message: 'Por favor llena todos los campos'
            });
        }
    }

    index(req,res) {
        res.status(200).json({
            success: true,
            message: 'Index page'
        });
    }

    registro(req,res){

        let cedula = req.body.cedula;
        let contrasenia = req.body.contrasenia;
        let nombres = req.body.nombres;
        let apellidos = req.body.apellidos;
        let correo = req.body.correo;
        

        if(cedula && contrasenia && nombres && apellidos && cedula && correo) { 
            contrasenia = security.encriptar(contrasenia);
            security.verificarUsuario(cedula, contrasenia)
                .then(doc => {
                    if(!doc){
                        conn.then(client => {
                            client.db().collection(config.USUARIOS).insertOne(
                                {cedula : cedula, contrasenia: contrasenia, nombres : nombres, apellidos: apellidos, cedula: cedula, correo: correo},
                                (err, r) =>{
                                    if(err){
                                        res.status(200).json({
                                            success: false,
                                            message: `Error while inserting new user into the database: ${err}`
                                        });
                                    }
                                    else {
                                        res.status(200).json({
                                            success: true,
                                            message: 'Succesfully created new user',
                                            data: {
                                                cedula: cedula,
                                                nombres: nombres,
                                                apellidos: apellidos
                                            }
                                        });
                                    }
                                }
                            );
                        });
                    }
                    else {
                        res.status(200).json({
                            success: false,
                            message: 'El usuario ya existe'
                        });
                    }
                })
                .catch(err => {
                    res.status(200).json({
                        success: false,
                        message:  `Authentication failed! There was an error during the process: ${err}`
                    });
                });
        }
        else {
            res.status(200).json({
                success: false,
                message: "datos incompletos"
            });
        }
    }
}

module.exports = HandlerGenerator;
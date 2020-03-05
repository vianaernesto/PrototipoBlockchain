let jwt = require('jsonwebtoken');
let config = require('./config.js');
let security = require('./security');

let conn = require('./usersDBConn');

class HandlerGenerator {

    login(req,res) {

        let usuario = req.body.usuario;
        let contrasenia = req.body.contrasenia;

        if(usuario && contrasenia) {

            contrasenia = security.encriptar(contrasenia);

            security.verificarUsuario(usuario,contrasenia)
                .then(doc =>{
                    if(!doc){
                        res.status(200).json({
                            success: false,
                            message: 'Nombre de usuario o contraseña incorrecta'
                        });
                    } 

                    else {
                        
                        let token = jwt.sign({nombreUsuario: doc.nombreUsuario, nombre: doc.nombre, apellido : doc.apellido, cedula: doc.cedula, correo: doc.correo, _id: doc._id},
                            config.secret, { expiresIn: '2h'});

                            res.status(200).json({
                                success: true,
                                message: 'Successfully added token to user',
                                token: token
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

        let usuario = req.body.usuario;
        let contrasenia = req.body.contrasenia;
        let nombre = req.body.nombre;
        let apellido = req.body.apellido;
        let cedula = req.body.cedula;
        let correo = req.body.correo;

        if(usuario && contrasenia && nombre && apellido && cedula && correo) { 
            contrasenia = security.encriptar(contrasenia);
            security.verificarUsuario(usuario, contrasenia)
                .then(doc => {
                    if(!doc){
                        conn.then(client => {
                            client.db().collection(config.USUARIOS).insertOne(
                                {usuario : usuario, contrasenia: contrasenia, nombre : nombre, apellido: apellido, cedula: cedula, correo: correo},
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
                                                usuario: usuario,
                                                nombre: nombre,
                                                apellido: apellido
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
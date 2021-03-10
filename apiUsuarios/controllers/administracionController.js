const Administracion = require('../models/AdministracionModel');
const Cliente = require('../clients/models/ClienteModel');
const bcryptjs = require('bcryptjs');
const {
    validationResult
} = require('express-validator');
const jwt = require('jsonwebtoken');


const crearUsuarioAdministrativo = async (req, res) => {

    //Revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        id
    } = req.usuario;

    const {
        email,
        password
    } = req.body

    try {
        let administrador = await Administracion.findById({
            _id: id
        });
        if (administrador.userType !== 'Managment') {
            return res.status(401).json({
                msg: 'You do not have permissions to create an administrative user'
            });
        }
        let usuario = await Administracion.findOne({
            email
        })
        if (usuario) {
            return res.status(400).json({
                msg: "This user has already been registered"
            });
        }

        // Creamos el nuevo usuario
        usuario = new Administracion(req.body);
        const salt = await bcryptjs.genSalt(8);
        usuario.password = await bcryptjs.hash(password, salt);
        await usuario.save();

        //token
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        jwt.sign(payload, process.env.TCRADMIN, {
            expiresIn: 86400 //24 Hrs
        }, (error, token) => {
            if (error) throw error;
            res.json({
                token: token
            });
        });

    } catch (error) {
        return res.status(400).send('There was a mistake');
    }
}

const obtenerInformacionTrabajador = async (req, res) => {

    const {
        id
    } = req.usuario

    const {
        search
    } = req.body;

    try {

        let infoTrabajador = await (Administracion.findById({
            _id: id
        })).select('-password -_id -__v');

        if (search !== '' && infoTrabajador.userType === 'Managment') {
            const alltrabajdor = await (Administracion.find()).select('-password -__v');
            res.json({
                alltrabajdor
            });
            return;
        }

        res.json({
            infoTrabajador
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'There was a mistake'
        });
    }
}

const actualizaInformacionTrabajador = async (req, res) => {

    //Revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    let {
        id
    } = req.usuario;

    let {
        userID,
        name,
        lastname,
        email,
        password,
        phoneNumber,
        role,
        userType,
    } = req.body

    const inforActualizada = {};

    if (name) {
        inforActualizada.name = name
    }
    if (lastname) {
        inforActualizada.lastname = lastname;
    }
    if (email) {
        inforActualizada.email = email;
    }

    if (userID.length !== 24 && password) {
        const salt = await bcryptjs.genSalt(8);
        inforActualizada.password = await bcryptjs.hash(password, salt);
    }

    if (phoneNumber) {
        inforActualizada.phoneNumber = phoneNumber;
    }

    try {

        //Revisar ID Trabajador
        let [usuario, confirmarEmail] = await Promise.all([
            Administracion.findById({
                _id: id
            }),
            Administracion.findOne({
                email
            }),
        ]);

        if (userID.length === 24 && usuario.userType !== 'Managment' || usuario._id.toString() !== id.toString()) {
            return res.status(401).json({
                msg: 'Unauthorized user'
            });
        }

        if (usuario.userType === 'Managment') {
            if (userID.length === 24) {
                usuario = await Administracion.findById({
                    _id: userID
                });
            }
            if (role) {
                inforActualizada.role = role;
            }
            if (userType) {
                inforActualizada.userType = userType;
            }
        }

        if (confirmarEmail) {
            if (usuario.email !== confirmarEmail.email && confirmarEmail) {
                return res.status(400).json({
                    msg: "The email is already associated with another user"
                });
            }
        }

        // Actualizar
        actualizarUsuario = await Administracion.findByIdAndUpdate({
            _id: usuario._id
        }, {
            $set: inforActualizada
        }, {
            new: true
        });
        res.json({
            actualizarUsuario
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "There was an error updating the information"
        })
    }
}

const borrarUsuarioAdministrativo = async (req, res) => {

    //Revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        id
    } = req.usuario

    const {
        userID
    } = req.body;

    try {


        const [usuario, usuarioExiste] = await Promise.all([
            Administracion.findById({
                _id: id
            }),
            Administracion.findById({
                _id: userID
            })
        ]);


        if (usuario.userType !== 'Managment') {
            return res.status(401).json({
                msg: "Unauthorized user"
            })
        }

        if (!usuarioExiste) {
            return res.status(404).json({
                msg: "The user you are trying to delete does not exist"
            })
        }

        await Administracion.findByIdAndRemove({
            _id: userID
        });
        res.json({
            msg: 'User was successfully removed'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "There was an error deleting this user"
        })
    }
}


const actualizarEachCliente = async (req, res) => {

    //Revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    let {
        id
    } = req.usuario

    let {
        clienteID,
        name,
        lastname,
        email,
        phoneNumber,
        project,
        financing,
        streetAddress,
        city,
        state,
        zipCode,
        country,
    } = req.body;

    const infoActualizada = {};

    if (name) {
        infoActualizada.name = name;
    }
    if (lastname) {
        infoActualizada.lastname = lastname;
    }
    if (email) {
        infoActualizada.email = email;
    }
    if (phoneNumber) {
        infoActualizada.phoneNumber = phoneNumber;
    }
    if (project) {
        infoActualizada.project = project;
    }
    if (financing) {
        infoActualizada.financing = financing;
    }
    if (streetAddress) {
        infoActualizada.streetAddress = streetAddress;
    }
    if (state) {
        infoActualizada.state = state;
    }
    if (city) {
        infoActualizada.city = city;
    }
    if (zipCode) {
        infoActualizada.zipCode = zipCode;
    }
    if (country) {
        infoActualizada.country = country;
    }

    try {

        //Revisar ID Cliente
        let [cliente, confirmarEmail, administrativo] = await Promise.all([
            Cliente.findById({
                _id: clienteID
            }),
            Cliente.findOne({
                email
            }),
            Administracion.findById({
                _id: id
            })
        ])

        // Comprobacion de administracion
        if (!administrativo._id || administrativo._id && administrativo.userType !== 'Managment') {
            return res.status(401).json({
                msg: 'Unauthorized user'
            })
        }

        //Comprobacion si usuario existe
        if (!cliente) {
            return res.status(401).json({
                msg: 'The client you are trying to delete does not exist'
            });
        }

        if (cliente.email !== email && confirmarEmail) {
            return res.status(400).json({
                msg: "The email is already associated with another client"
            })
        }

        // Actualizar
        actualizarCliente = await (Cliente.findByIdAndUpdate({
            _id: cliente._id
        }, {
            $set: infoActualizada
        }, {
            new: true
        })).select('-password -__v');
        res.json({
            actualizarCliente
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'There was an error updating the information'
        })
    }
}


const obtenterTodosClientes = async (req, res) => {

    const {
        id
    } = req.usuario;

    try {

        const administrativo = await Administracion.findById({
            _id: id
        });

        if (administrativo.userType !== "Managment") {
            return res.status(401).json({
                msg: "Unauthorized user"
            })
        }

        const clienteData = await (Cliente.find()).select('-password -__v');

        res.json({
            clienteData
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: "There was an error getting the clients information"
        })
    }
}

module.exports = [
    crearUsuarioAdministrativo,
    obtenerInformacionTrabajador,
    actualizaInformacionTrabajador,
    borrarUsuarioAdministrativo,
    actualizarEachCliente,
    obtenterTodosClientes
];
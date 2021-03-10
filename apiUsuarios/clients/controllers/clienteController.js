const Cliente = require('../models/ClienteModel');
const ContactUs = require('../models/ContactUsModel');
const Services = require('../../../apiServices/models/serviceModel')
const bcryptjs = require('bcryptjs');
const sendEmail = require('../../../apiEmail/clients/sendEmail');
const sendEmailAdministrative = require('../../../apiEmail/management/sendEmailAdministrative')
const {
    validationResult
} = require('express-validator');
const jwt = require('jsonwebtoken');



const crearCliente = async (req, res) => {
    //Revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        name,
        lastName,
        email,
        phoneNumber,
        project,
        projectType,
        financing,
        streetAddress,
        city,
        state,
        zipCode,
        clientIP
    } = req.body;

    try {
        // Validando usuario repetido
        const clientExiste = await Cliente.findOne({
            email
        });


        if (clientExiste) {
            return res.status(400).json({
                msg: 'Sorry, this email is already being used by another client, try a different one',
                category: 't-popup-error-1'
            });
        };

        const infoClient = {
            name,
            lastName,
            email,
            phoneNumber,
            streetAddress,
            city,
            state,
            zipCode,
            clientIP
        }

        // Creando nuevo usuario
        const cliente = new Cliente(infoClient);
        console.log(cliente);
        const salt = await bcryptjs.genSalt(8);
        cliente.password = await bcryptjs.hash(cliente.password, salt);
        await cliente.save();

        // Creando servicio
        const createService = {
            project,
            projectType,
            financing,
            streetAddress,
            city,
            state,
            zipCode,
            clientId: cliente._id
        }

        const service = new Services(createService);
        await service.save();

        sendEmail(req.body);
        sendEmailAdministrative(req.body);

        //token
        const payload = {
            cliente: {
                id: cliente.id
            }
        };

        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 7200 //2 Hrs
        }, (error, token) => {
            if (error) throw error;
            res.json({
                token: token,
            });
        });


        /* const token = jwt.sign(payload, process.env.SECRET)

        res.cookie('access_token', token, {
            maxAge: 3600,
            httpOnly: true
        })

        res.status(200).end(); */

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: 'There was a mistake',
            category: 't-popup-error-1'
        });

    }
}

const obtenerInformacionCliente = async (req, res) => {
    const {
        id
    } = req.cliente

    console.log(id)
    console.log("ejecutabdo")

    try {
        const infoUsuario = await (Cliente.findById({
            _id: id
        })).select('-password -subject -optMessage -role -statusProject -_id -__v -clientIP -lastConnection');
        res.json({
            infoUsuario
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'The was a mistake',
            category: 't-popup-error-1'
        });
    }
}

const updateClientInformation = async (req, res) => {

    //Revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    let {
        id
    } = req.cliente;

    let {
        name,
        lastName,
        phoneNumber,
        streetAddress,
        city,
        state,
        zipCode,
    } = req.body;

    try {

        //Revisar ID Cliente
        const cliente = await Cliente.findById({
            _id: id
        });

        if (!cliente) {
            return res.status(401).json({
                msg: 'Unauthorized user',
                category: 't-popup-error-1'
            });
        }

        // Comprobacion adicional
        if (cliente._id.toString() !== id.toString()) {
            return res.status(401).json({
                msg: 'Unauthorized user',
                category: 't-popup-error-1'
            });
        }

        const infoActualizada = {};

        if (cliente.name.toLowerCase() !== name.toLowerCase()) {
            infoActualizada.name = name.toLowerCase();
        }
        if (cliente.lastName.toLowerCase() !== lastName.toLowerCase()) {
            infoActualizada.lastName = lastName.toLowerCase();
        }
        if (Number(cliente.phoneNumber) !== Number(phoneNumber)) {
            infoActualizada.phoneNumber = phoneNumber;
        }
        if (cliente.streetAddress.toLowerCase() !== streetAddress.toLowerCase()) {
            infoActualizada.streetAddress = streetAddress.toLowerCase();
        }
        if (cliente.city.toLowerCase() !== city.toLowerCase()) {
            infoActualizada.city = city.toLowerCase();
        }
        if (cliente.state.toLowerCase() !== state.toLowerCase()) {
            infoActualizada.state = state.toLowerCase();
        }
        if (cliente.zipCode !== zipCode) {
            infoActualizada.zipCode = zipCode;
        }

        console.log(infoActualizada);

        if (Object.keys(infoActualizada).length === 0) {
            return res.status(400).json({
                msg: 'No changes to your information were detected',
                category: 't-popup-error-1'
            });
        }

        // Actualizar
        actualizarCliente = await (Cliente.findByIdAndUpdate({
            _id: cliente._id
        }, {
            $set: infoActualizada
        }, {
            new: true
        })).select('-password -userType -_id -__v');
        res.json({
            msg: 'Your information was updated',
            category: 't-popup-correct-1'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'There was an error updating the information',
            category: 't-popup-error-1'
        });
    }
}

const updateClientPassword = async (req, res) => {

    //Revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        id
    } = req.cliente;

    let {
        password,
        newPassword
    } = req.body;

    try {

        const cliente = await Cliente.findById({
            _id: id
        });

        if (!cliente) {
            return res.status(401).json({
                msg: 'Unauthorized access',
                category: 't-popup-error-1'
            });
        }

        if (cliente._id.toString() !== id) {
            return res.status(401).json({
                msg: 'Unauthorized access',
                category: 't-popup-error-1'
            });
        }

        const passCorrecto = await bcryptjs.compare(password, cliente.password);
        if (!passCorrecto) {
            return res.status(401).json({
                msg: 'Sorry, your current password is wrong',
                category: 't-popup-error-1'
            })
        }

        const mismoPassword = await bcryptjs.compare(newPassword, cliente.password);
        if (mismoPassword) {
            return res.status(400).json({
                msg: 'Your new password is the same as your current password, it must be different',
                category: 't-popup-error-1'
            })
        }
        const salt = await bcryptjs.genSalt(8);
        let actualizarPassword = {
            password: await bcryptjs.hash(newPassword, salt)
        }

        actualizarPassword = await Cliente.findByIdAndUpdate({
            _id: cliente._id
        }, {
            $set: actualizarPassword
        }, {
            new: true
        });
        res.status(200).json({
            msg: 'Your password was updated correctly',
            category: 't-popup-correct-1'
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: 'Sorry, there was an error doing this action.',
            category: 't-popup-error-1'
        });
    }
}

const datosContactUs = async (req, res) => {
    //Revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        clientIP
    } = req.body

    const fecha = new Date(Date.now());
    try {

        const validarIP = await ContactUs.findOne({
            clientIP
        });

        if (validarIP && fecha.toUTCString().slice(0, 16) === validarIP.registerDate.toUTCString().slice(0, 16)) {
            console.log(fecha.toUTCString().slice(0, 16));
            console.log(validarIP.registerDate.toUTCString().slice(0, 16));

            return res.status(400).json({
                msg: 'Sorry, you already have a previous message today, you can send another tomorrow',
                category: 't-popup-error-1'
            });
        }

        const client = new ContactUs(req.body);
        await client.save();
        res.status(200).json({
            msg: 'The message was sent correctly, in the next few days our team will contact you',
            category: 't-popup-correct-1'
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: 'There was an error updating the information.',
            category: 't-popup-error-1'
        });
    }
}


module.exports = [
    crearCliente,
    obtenerInformacionCliente,
    updateClientInformation,
    updateClientPassword,
    datosContactUs,
]
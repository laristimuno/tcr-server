const express = require('express');
const router = express.Router();
const [
    crearCliente,
    obtenerInformacionCliente,
    updateClientInformation,
    updateClientPassword,
    datosContactUs,
] = require('../controllers/clienteController');
const [comprobarAuthCliente] = require('../../../middleware/comprobarAuth');
const {
    check,
} = require('express-validator');


// Registra a un cliente desde el formulario de servicio y crea un servicio
// api/clients

router.post('/',
    [
        check('name', 'The name is required').not().isEmpty().trim().escape(),
        check('lastName', 'The lastname is required').not().isEmpty().trim().escape(),
        check('email', 'The name is required').isEmail().trim().escape(),
        check('phoneNumber', 'The phone number must be 10 characters').isLength({
            min: 10,
            max: 10
        }),
        check('project', 'The project is required').not().isEmpty().trim().escape(),
        check('projectType', 'The type of project is required').not().isEmpty().trim().escape(),
        check('financing', 'The financing is required').not().isEmpty().trim().escape(),
        check('streetAddress', 'The streetAddress is required').not().isEmpty().trim().escape(),
        check('city', 'The city is required').not().isEmpty().trim().escape(),
        check('state', 'The state is required').not().isEmpty().trim().escape(),
        check('zipCode', 'The zipCode is required').not().isEmpty().trim().escape(),
        check('clientIP', 'The message is required').isIP().trim().escape(),
    ],

    crearCliente,
);

// Obtener informacion del cliente
// api/clients

router.get('/',
    comprobarAuthCliente,
    obtenerInformacionCliente
);


// El cliente actualiza su informacion (no password)
// api/clients

router.put('/',
    comprobarAuthCliente,
    [
        check('name', 'The name is required').not().isEmpty(),
        check('lastName', 'The last name is required').not().isEmpty(),
        check('phoneNumber', 'The phone number must be 10 characters').isLength({
            min: 10,
            max: 10
        }),
        check('streetAddress', 'The streetAddress is required').not().isEmpty(),
        check('city', 'The city is required').not().isEmpty(),
        check('state', 'The state is required').not().isEmpty(),
        check('zipCode', 'The zipCode is required').not().isEmpty(),
    ],
    updateClientInformation
);


// Cliente actualiza su password
// api/managment/clients/updatepassword

router.put('/updatepassword',
    comprobarAuthCliente,
    [
        check('password', 'This password is not valid, remember that it must be at least 8 characters long.').not().isEmpty().isLength({
            min: 8
        }),
        check('newPassword', 'This password is not valid, remember that it must be at least 8 characters long.').not().isEmpty().isLength({
            min: 8
        }).custom((value, {
            req,
        }) => {
            if (value !== req.body.confirmNewPassword) {
                throw new Error("Passwords don't match")
            } else {
                return value;
            }
        }),
        check('confirmNewPassword', 'This password is not valid, remember that it must be at least 8 characters long.').not().isEmpty().isLength({
            min: 8
        }),
    ],
    updateClientPassword
);


// Crea un contact us del cliente desde el formulario de contac us
// api/clients/contact-us

router.post('/contact-us',
    [
        check('name', 'The name is required').not().isEmpty().trim().escape(),
        check('lastName', 'The lastname is required').not().isEmpty().trim().escape(),
        check('email', 'The name is required').isEmail().trim().escape(),
        check('subject', 'The subject is required').not().isEmpty().trim().escape(),
        check('message', 'The message is required').not().isEmpty().trim().escape(),
        check('clientIP', 'The message is required').isIP().trim().escape(),
    ],
    datosContactUs
);

module.exports = router;
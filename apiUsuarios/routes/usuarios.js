// Rutas de clientes del formulario de servicio
const express = require('express');
const router = express.Router();
const [crearUsuarioAdministrativo, obtenerInformacionTrabajador, actualizaInformacionTrabajador, borrarUsuarioAdministrativo, actualizarEachCliente, obtenterTodosClientes] = require('../controllers/administracionController')
const [, comprobarAuthAdministracion] = require('../../middleware/comprobarAuth');
const {
    check,
} = require('express-validator');


// Registra a un usuario Administrativo
// api/usuarios/administracion

router.post('/administracion',
    comprobarAuthAdministracion,
    [
        check('name', 'The name is required').not().isEmpty(),
        check('lastname', 'The lastname is required').not().isEmpty(),
        check('email', 'The email is required').isEmail(),
        check('password', 'The password must be at least 8 characters').isLength({
            min: 8
        }),
        check('phoneNumber', 'The phone number must be 10 characters').isLength({
            min: 10,
            max: 10
        }),
        check('role', 'The role is required').not().isEmpty(),
        check('userType', 'The user type is required').not().isEmpty()
    ],
    crearUsuarioAdministrativo,
);

// Obtener a un profile de un Administrativo o Obtener todos los usuarios administrativos
// api/usuarios/administracion

router.get('/administracion',
    comprobarAuthAdministracion,
    obtenerInformacionTrabajador
)

// Actualiza a un usuario Administrativo o Usuario actualiza su profile administrativo
// api/usuarios/administracion

router.put('/administracion',
    comprobarAuthAdministracion,
    [
        check('name', 'The name is required').not().isEmpty(),
        check('lastname', 'The lastname is required').not().isEmpty(),
        check('email', 'The email is required').isEmail(),
        check('phoneNumber', 'The phone number must be 10 characters').isLength({
            min: 10,
            max: 10
        }),
        check('role', 'The role is required').not().isEmpty()
    ],
    actualizaInformacionTrabajador
);

// Elimina un usuario administrativo
// api/usuarios/administracion

router.delete('/administracion',
    comprobarAuthAdministracion,
    [
        check('userID', 'User ID is not valid, please check').isLength({
            min: 24,
            max: 24
        })
    ],
    borrarUsuarioAdministrativo
);

// Crea un cliente desde el panel administrativo
// api/usuarios/administracion/clientes

router.post('/administracion/clientes',
    comprobarAuthAdministracion,
    [
        check('name', 'The name is required').not().isEmpty(),
        check('lastname', 'The lastname is required').not().isEmpty(),
        check('email', 'The email is required').isEmail(),
        check('phoneNumber', 'The phone number must be 10 characters').isLength({
            min: 10,
            max: 10
        }),
        check('project', 'The project is required').not().isEmpty(),
        check('financing', 'The financing is required').not().isEmpty(),
        check('streetAddress', 'The streetAddress is required').not().isEmpty(),
        check('city', 'The city is required').not().isEmpty(),
        check('state', 'The state is required').not().isEmpty(),
        check('zipCode', 'The zipCode is required').not().isEmpty(),
        check('country', 'The country is required').not().isEmpty(),
    ],
    //crearCliente
);

// Obten todos los clientes desde el panel administrativo
// api/usuarios/administracion/clientes

router.get('/administracion/clientes',
    comprobarAuthAdministracion,
    obtenterTodosClientes
);

// Edita un cliente desde el panel administrativo
// api/usuarios/administracion/clientes

router.put('/administracion/clientes',
    comprobarAuthAdministracion,
    [
        check('clienteID', 'Customer Id must be valid').isLength({
            min: 24,
            max: 24
        }),
        check('name', 'The name is required').not().isEmpty(),
        check('lastname', 'The lastname is required').not().isEmpty(),
        check('email', 'The name is required').isEmail(),
        check('phoneNumber', 'The phone number must be 10 characters').isLength({
            min: 10,
            max: 10
        }),
        check('project', 'The project is required').not().isEmpty(),
        check('financing', 'The financing is required').not().isEmpty(),
        check('streetAddress', 'The streetAddress is required').not().isEmpty(),
        check('city', 'The city is required').not().isEmpty(),
        check('state', 'The state is required').not().isEmpty(),
        check('zipCode', 'The zipCode is required').not().isEmpty(),
        check('country', 'The country is required').not().isEmpty(),
        check('statusProject', 'The statusProject is required').not().isEmpty(),
    ],
    actualizarEachCliente
);

module.exports = router;
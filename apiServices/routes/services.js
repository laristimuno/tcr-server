const express = require('express');
const router = express.Router();
const [createService, obtenerServices, actualizarService, eliminarService, getClientServices, updateClientAppointment] = require('../controllers/serviceController');
const [comprobarAuthCliente, comprobarAuthAdministracion] = require('../../middleware/comprobarAuth')
const {
    check
} = require('express-validator');


// Crea los servicios de forma administrativa
// /api/services

router.post('/',
    comprobarAuthAdministracion,
    [
        check('serviceName', 'Project name is required').not().isEmpty().bail(),
        check('projectDetails', 'Project details is required').not().isEmpty().bail(),
    ],
    createService
);

// Obteniendo todos los servicios creados
// /api/services

router.get('/', comprobarAuthAdministracion, obtenerServices);

// Actualizando servicio por Id (Solo administracion)
// /api/services

router.put('/',
    comprobarAuthAdministracion,
    check('serviceName', 'The name of the project cannot be empty').not().isEmpty(),
    check('projectDetails', 'You must specify the project details').not().isEmpty(),
    actualizarService
);

// Eliminando servicio por Id (Solo administracion)
// /api/services

router.delete('/', comprobarAuthAdministracion, eliminarService);


/******** RUTAS PARA LOS CLIENTES **************/

// Cliente obtiene los servicios creados
// /api/services/client

router.get('/client',
    comprobarAuthCliente,
    getClientServices
);

// Cliente obtiene los servicios creados
// /api/services/client/appointment

router.post('/client/appointment',
    comprobarAuthCliente,
    updateClientAppointment
);


module.exports = router;
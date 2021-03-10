const express = require('express');
const router = express.Router();
const {
    check
} = require('express-validator');
const [agregarProjecto, actualizarProyecto, eliminarProject, agregarProjectoAdministracion, actualizarProjectAdministracion, eliminarProjectAdministracion, obtenerProjectAdministracion] = require('../controllers/projectController')
const [comprobarAuthCliente, comprobarAuthAdministracion] = require('../../middleware/comprobarAuth');

// Agrega un proyeto desde clientes
// api/projects/cliente

router.post('/cliente',
    comprobarAuthCliente,
    [
        check('servicioID', 'The service id is invalid').isLength({
            min: 24,
            max: 24
        }),
        check('projectDetails', 'This field project details cannot is empty').not().isEmpty()
    ],
    agregarProjecto
);

// Actualizar un proyeto desde clientes
// api/projects/cliente

router.put('/cliente',
    comprobarAuthCliente,
    [
        check('projectID', 'The project id is invalid').isLength({
            min: 24,
            max: 24
        }),
        check('projectDetails', 'This field project details cannot is empty').not().isEmpty(),
    ],
    actualizarProyecto
);

// Eliminar un proyeto desde clientes
// api/projects/cliente

router.delete('/cliente',
    comprobarAuthCliente,
    check('projectID', 'The project id is invalid').isLength({
        min: 24,
        max: 24
    }),
    eliminarProject
);

// Agregar un proyecto al cliente desde el administrador
// api/projects/administracion

router.post('/administracion',
    comprobarAuthAdministracion,
    [
        check('servicioID', 'The service id is invalid').isLength({
            min: 24,
            max: 24
        }),
        check('ClienteID', 'The client id is invalid').isLength({
            min: 24,
            max: 24
        }),
        check('projectDetails', 'The field project details cannot is empty').not().isEmpty()
    ],
    agregarProjectoAdministracion
);

// Edita un proyecto del cliente desde administrador
// api/projects/administracion

router.put('/administracion',
    comprobarAuthAdministracion,
    [
        check('projectID', 'The service id is invalid').isLength({
            min: 24,
            max: 24
        }),
        check('ClienteID', 'The client id is invalid').isLength({
            min: 24,
            max: 24
        }),
        check('projectDetails', 'The field project details cannot is empty').not().isEmpty(),
        check('projectStatus', 'The field project details cannot is empty').not().isEmpty(),
        check('startDate', 'The field project details cannot is empty').not().isEmpty(),
        check('projectPrice', 'The field project details cannot is empty').isNumeric(),
    ],
    actualizarProjectAdministracion
);

// Eliminar un proyecto del cliente desde administrador
// api/projects/administracion

router.delete('/administracion',
    comprobarAuthAdministracion,
    [
        check('projectID', 'The service id is invalid').isLength({
            min: 24,
            max: 24
        }),
        check('ClienteID', 'The client id is invalid').isLength({
            min: 24,
            max: 24
        }),
    ],
    eliminarProjectAdministracion
);
// Obteniendo todos los proyectos en el administrador
// api/projects/administracion

router.get('/administracion',
    comprobarAuthAdministracion,
    obtenerProjectAdministracion
);

module.exports = router;
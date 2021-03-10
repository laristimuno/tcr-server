// Rutas para autenticar Clientes
const express = require('express');
const router = express.Router();
const [autenticarCliente, autenticarAdministracion] = require('../controllers/authController');
const {
    check
} = require('express-validator');


// Registra a un cliente desde el formulario de servicio
// api/auth/clientes

router.post('/clientes',
    [
        check('email', 'The email is required').isEmail(),
        check('password', 'The password must be at least 8 characters').isLength({
            min: 8
        })
    ],
    autenticarCliente
);
// Registra a un cliente desde el formulario de servicio
// api/auth/administracion

router.post('/administracion',
    [
        check('email', 'The email is required').isEmail(),
        check('password', 'The password must be at least 8 characters').isLength({
            min: 8
        })
    ],
    autenticarAdministracion
);

module.exports = router;
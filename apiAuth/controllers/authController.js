const Cliente = require('../../apiUsuarios/clients/models/ClienteModel');
const Administracion = require('../../apiUsuarios/models/AdministracionModel');
const bcryptjs = require('bcryptjs');
const {
    validationResult
} = require('express-validator');
const jwt = require('jsonwebtoken');

const autenticarCliente = async (req, res) => {

    // Revisar errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const {
        email,
        password
    } = req.body;

    try {
        //cliente existe
        let cliente = await Cliente.findOne({
            email
        });
        if (!cliente) {
            return res.status(400).json({
                msg: 'Sorry, this customer is not registered',
                category: "t-popup-error-1"
            })
        }

        const passCorrecto = await bcryptjs.compare(password, cliente.password);
        if (!passCorrecto) {
            return res.status(400).json({
                msg: 'Sorry, your email or password is wrong',
                category: "t-popup-error-1"
            })
        }

        const payload = {
            cliente: {
                id: cliente.id
            }
        };

        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 7200 // 2 hrs
        }, (error, token) => {
            if (error) throw error;

            res.json({
                token: token
            })
        });


        /* const token = jwt.sign(payload, process.env.SECRET);

        res.cookie('access_token', token, {
            maxAge: 3600,
            httpOnly: true
        })

        res.status(200).end(); */

    } catch (error) {
        console.log(error)
    }
}

const autenticarAdministracion = async (req, res) => {
    // Revisar errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const {
        email,
        password
    } = req.body;

    try {
        //Usuario de administracion existe
        let usuario = await Administracion.findOne({
            email
        });

        if (!usuario) {
            return res.status(400).json({
                msg: 'Sorry, this user is not registered',
                category: "t-popup-error-1"
            });
        }

        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if (!passCorrecto) {
            return res.status(400).json({
                msg: 'Sorry, your password or email is wrong',
                category: "t-popup-error-1"
            })
        }

        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        jwt.sign(payload, process.env.TCRADMIN, {
            expiresIn: 86300 // 24 hrs
        }, (error, token) => {
            if (error) throw error;
            res.json({
                token: token
            });
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = [autenticarCliente, autenticarAdministracion];
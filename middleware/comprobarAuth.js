const jwt = require('jsonwebtoken');


const comprobarAuthCliente = async (req, res, next) => {
    //Leer el token del header
    //const token = req.cookies.access_token
    const token = req.header('x-auth-token');

    //Revisar si no hya token
    if (!token) {
        return res.status(401).json({
            msg: 'Unauthorized user, must have authorization',
            category: "t-popup-error-1"
        })
    }

    //Validar el token

    try {
        const cifrado = await jwt.verify(token, process.env.SECRET);
        req.cliente = cifrado.cliente;
        next();

    } catch (error) {
        res.status(401).json({
            msg: 'The session has expired',
            category: "t-popup-error-1"
        })
    }
}

const comprobarAuthAdministracion = async (req, res, next) => {
    //Leer el token del header
    const token = req.header('x-auth-token');
    console.log(token);

    //Revisar si no hya token
    if (!token) {
        return res.status(401).json({
            msg: 'Unauthorized, must have authorization'
        })
    }

    //Validar el token

    try {
        const cifrado = await jwt.verify(token, process.env.TCRADMIN);
        req.usuario = cifrado.usuario;
        next();

    } catch (error) {
        res.status(401).json({
            msg: 'Unauthorized user, must have authorization'
        })
    }
}

module.exports = [comprobarAuthCliente, comprobarAuthAdministracion]
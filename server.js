const express = require('express');
const conectarDB = require('./config/db')
const cookieParser = require('cookie-parser')
const cors = require('cors');

//servidor
const app = express();

//Conexion DB
conectarDB();

// Habiliotar cors
/* app.use(cors()); */


// Habiliotar cors
app.use(cors({
    origin: process.env.TCRURL,
    credentials: true
}));

// Cookies
app.use(cookieParser());

//Habilitando express.json
app.use(express.json({
    extended: true
}))

//Puerto DB
const PORT = process.env.PORT || 4000;

//Importando rutas
app.use('/api/clients', require('./apiUsuarios/clients/routes/clientsRoutes'));
app.use('/api/usuarios', require('./apiUsuarios/routes/usuarios'));
app.use('/api/auth', require('./apiAuth/routes/authUsuarios'));
app.use('/api/services', require('./apiServices/routes/services'));
app.use('/api/projects', require('./apiProjects/routes/projects'));



//Arrancando app
app.listen(PORT, '0.0.0.0', () => {
    console.log(`El servidor esta trabajando en el puerto ${PORT}`);
})
const mongoose = require('mongoose');

const AdministracionSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    lastname: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
        trim: true
    },
    phoneNumber: {
        type: Number,
        require: true,
        trim: true,
    },
    role: {
        type: String,
        requiere: true,
        trim: true
    },
    userType: {
        type: String,
        requiere: true,
        trim: true
    },
    registerDate: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model('Administracion', AdministracionSchema);
const mongoose = require('mongoose');

const ClienteSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        trim: true,
        default: 12345678
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    phoneNumber: {
        type: Number,
        trim: true,
        required: true,
    },
    streetAddress: {
        type: String,
        trim: true,
        required: true,
    },
    city: {
        type: String,
        trim: true,
        required: true,
    },
    state: {
        type: String,
        trim: true,
        required: true,
    },
    zipCode: {
        type: String,
        trim: true,
        required: true,
    },
    country: {
        type: String,
        trim: true,
        default: "United States"
    },
    userType: {
        type: String,
        trim: true,
        default: "client"
    },
    clientIP: {
        type: String,
        trim: true,
        required: true,
    },
    registerDate: {
        type: Date,
        default: Date.now,
    },
    lastConnection: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('Cliente', ClienteSchema);
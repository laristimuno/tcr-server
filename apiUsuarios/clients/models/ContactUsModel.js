const mongoose = require('mongoose');

const ContactUsSchema = mongoose.Schema({
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
    email: {
        type: String,
        required: true,
        trim: true,
    },
    subject: {
        type: String,
        trim: true,
        required: true,
    },
    message: {
        type: String,
        trim: true,
        required: true,
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
        default: Date.now
    },
})

module.exports = mongoose.model('ContactUs', ContactUsSchema);
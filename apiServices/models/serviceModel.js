const mongoose = require('mongoose');

const date = new Date();
const today = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);

const ServiceSchema = mongoose.Schema({
    order: {
        type: String,
        requiered: true,
        default: () => `TCR-${Date.now() - 1615132777476}`,
    },
    project: {
        type: String,
        requiered: true,
        trim: true,
    },
    projectType: {
        type: String,
        requiered: true,
        trim: true,
    },
    financing: {
        type: String,
        requiered: true,
        trim: true,
    },
    streetAddress: {
        type: String,
        requiered: true,
        trim: true,
    },
    city: {
        type: String,
        requiered: true,
        trim: true,
    },
    state: {
        type: String,
        requiered: true,
        trim: true,
    },
    zipCode: {
        type: String,
        requiered: true,
        trim: true,
    },
    country: {
        type: String,
        trim: true,
        default: "United States"
    },
    projectStatus: {
        type: String,
        trim: true,
        default: "Our team is reviewing your request in the next few hours you will be contacted"
    },
    projectPrice: {
        type: String,
        trim: true,
        default: "Not calculated yet"
    },
    appointmentDate: {
        type: String,
        trim: true,
        default: Date.now
    },
    appointmentDate: {
        type: String,
        trim: true,
        default: today
    },
    appointmentTime: {
        type: String,
        trim: true,
        default: '10:00'
    },
    typeOfAppointment: {
        type: String,
        trim: true,
        default: 'Pending to define'
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cliente"
    },
    createDate: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('Services', ServiceSchema)
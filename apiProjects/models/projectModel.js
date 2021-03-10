const mongoose = require('mongoose');


const ProjectSchema = mongoose.Schema({
    servicioID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Services',
    },
    projectName: {
        type: mongoose.Schema.Types.String,
        ref: 'Services',
        trim: true,
    },
    projectDetails: {
        type: String,
        required: true,
        trim: true,
    },
    clienteID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente'
    },
    projectStatus: {
        type: String,
        default: "Not started",
    },
    startDate: {
        type: String,
        default: "Not started",
    },
    registerDate: {
        type: Date,
        default: Date.now(),
    },
    projectPrice: {
        type: Number,
        default: null
    }
})

module.exports = mongoose.model('Project', ProjectSchema);
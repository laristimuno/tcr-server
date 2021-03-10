const Services = require('../models/serviceModel');
const Cliente = require('../../apiUsuarios/clients/models/ClienteModel')
const Administracion = require('../../apiUsuarios/models/AdministracionModel')
const {
    validationResult
} = require('express-validator');


const createService = async (req, res) => {
    // Errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        serviceName,
    } = req.body;

    try {

        let service = await Services.findOne({
            serviceName
        });

        if (service) {
            return res.status(400).json({
                msg: 'Project name already exists, please try a different one'
            })
        }
        service = new Services(req.body);
        await service.save();
        res.json({
            service
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: "There was an error creating the new project, please check again"
        })
    }
}

const obtenerServices = async (req, res) => {
    try {
        const services = await Services.find();
        res.json({
            services
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: 'The was a mistake'
        })
    }
}

const actualizarService = async (req, res) => {

    //Revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        id
    } = req.usuario;

    const {
        projectId,
        serviceName,
        projectDetails
    } = req.body;

    const updateService = {}

    if (serviceName) {
        updateService.serviceName = serviceName;
    }
    if (projectDetails) {
        updateService.projectDetails = projectDetails;
    }

    try {

        // Revisar ID
        let usuario = await Administracion.findById({
            _id: id
        });

        // Comprobacion de nivel usuario
        if (usuario.userType !== 'Management') {
            return res.status(401).json({
                msg: 'You are not authorized to make this request'
            });
        }

        // Nombre de servicio no repetido
        let newProjectName = await Services.findOne({
            serviceName
        });
        const projectNameActual = await Services.findById({
            _id: projectId
        });

        if (projectNameActual.projectName !== projectName && newProjectName) {
            return res.status(400).json({
                msg: "Sorry, this service name is already taking for another project"
            })
        }

        updateService = await Services.findByIdAndUpdate({
            _id: projectId
        }, {
            $set: updateService
        }, {
            new: true
        });
        res.json({
            updateService
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: 'There was an error updating this service'
        })
    }
}

const eliminarService = async (req, res) => {
    //Revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        id
    } = req.usuario;

    const {
        projectId
    } = req.body;

    try {
        // Revisar ID
        let usuario = await Administracion.findById({
            _id: id
        });

        // Comprobacion de nivel usuario
        if (usuario.userType !== 'Management') {
            return res.status(401).json({
                msg: 'You are not authorized to make this request'
            });
        }

        // Comprobar que servicio exista

        let serviceExiste = await Services.findById({
            _id: projectId
        });

        if (!serviceExiste) {
            return res.status(404).json({
                msg: 'This service does not exist'
            });
        }

        await Services.findOneAndRemove({
            _id: projectId
        })
        res.json({
            msg: 'The service was removed'
        });


    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: "There was an error deleting this service"
        })
    }
}


const getClientServices = async (req, res) => {
    const {
        id
    } = req.cliente
    try {
        const client = await Cliente.findById({
            _id: id
        })

        if (!client) {
            return res.status(404).json({
                msg: 'Sorry, you are not registered.',
                category: "t-popup-error-1"
            })
        }

        if (client.id.toString() !== id) {
            return res.status(401).json({
                msg: 'Unauthorized user',
                category: 't-popup-error-1'
            })
        }

        const service = await (Services.find({
            clientId: client._id
        })).select('-clientId')

        res.status(200).json({
            service
        })
    } catch (error) {
        return res.status(400).json({
            msg: 'There was a mistake',
            category: 't-popup-error-1'
        });
    }
}

const updateClientAppointment = async (req, res) => {
    //Revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        id
    } = req.cliente;

    const {
        idService,
        appointmentDate,
        appointmentTime,
        typeOfAppointment
    } = req.body;


    try {
        const cliente = await Cliente.findById({
            _id: id
        });

        if (!cliente) {
            return res.status(404).json({
                msg: 'Sorry, you are not registered.',
                category: "t-popup-error-1"
            });
        }

        if (cliente._id.toString() !== id) {
            return res.status(401).json({
                msg: 'Unauthorized user',
                category: 't-popup-error-1'
            });
        }


        const service = await Services.findById({
            _id: idService
        });


        if (!service) {
            return res.status(404).json({
                msg: 'This service does not exist',
                category: "t-popup-error-1"
            });
        }

        if (service.clientId.toString() !== id) {
            return res.status(401).json({
                msg: 'Unauthorized user',
                category: 't-popup-error-1'
            });
        }

        let newAppointment = {
            appointmentDate,
            appointmentTime,
            typeOfAppointment
        }

        console.log(newAppointment);


        newAppointment = await Services.findByIdAndUpdate({
            _id: idService
        }, {
            $set: newAppointment
        }, {
            new: true
        });
        res.status(200).json({
            msg: 'Your appointment was successfully booked',
            category: 't-popup-correct-1'
        });

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            msg: 'There was a mistake',
            category: 't-popup-error-1'
        });
    }
}
module.exports = [createService, obtenerServices, actualizarService, eliminarService, getClientServices, updateClientAppointment];
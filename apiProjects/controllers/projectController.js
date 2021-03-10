const Cliente = require('../../apiUsuarios/clients/models/ClienteModel');
const Administracion = require('../../apiUsuarios/models/AdministracionModel')
const Services = require('../../apiServices/models/serviceModel');
const Project = require('../../apiProjects/models/projectModel')
const {
    validationResult
} = require('express-validator');



const agregarProjecto = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    let {
        id
    } = req.cliente;

    const {
        servicioID,
        projectDetails
    } = req.body;

    try {

        const [cliente, servicioExiste] = await Promise.all([
            Cliente.findById({
                _id: id
            }),
            Services.findById({
                _id: servicioID
            })
        ]);

        if (cliente._id.toString() !== id.toString()) {
            return res.status(401).json({
                msg: 'You are not authorized to make this request'
            })
        }

        if (!servicioExiste) {
            return res.status(404).json({
                msg: 'Sorry, the project you are adding is no longer available'
            })
        }
        const project = {
            servicioID: servicioExiste._id,
            projectName: servicioExiste.projectName,
            projectDetails: projectDetails,
            clienteID: cliente._id
        }

        const addProject = new Project(project);
        await addProject.save();
        res.json({
            addProject
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: "There was an error creating this project"
        })
    }
}

const actualizarProyecto = async (req, res) => {
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
        projectID,
        projectDetails
    } = req.body;

    let updateProject = {}

    if (projectDetails) {
        updateProject.projectDetails = projectDetails;
    }

    try {
        const validarProject = await Project.findById({
            _id: projectID
        });

        if (!validarProject) {
            return res.status(404).json({
                msg: 'Sorry, this project does not exist'
            })
        }

        if (id.toString() !== validarProject.clienteID.toString()) {
            return res.status(401).json({
                msg: 'You are not authorized to make this request'
            })
        }

        updateProject = await Project.findByIdAndUpdate({
            _id: validarProject._id
        }, {
            $set: updateProject
        }, {
            new: true
        });
        res.json({
            updateProject
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: "There was an Error updating this project"
        })
    }
}

const eliminarProject = async (req, res) => {

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
        projectID
    } = req.body;

    try {

        const validarProject = await Project.findById({
            _id: projectID
        });

        if (!validarProject) {
            return res.status(404).json({
                msg: 'Sorry, this project does not exist'
            })
        }

        if (id.toString() !== validarProject.clienteID.toString()) {
            return res.status(401).json({
                msg: 'You are not authorized to make this request'
            })
        }

        await Project.findByIdAndRemove({
            _id: projectID
        });
        res.json({
            msg: 'The project was deleted correctly'
        });


    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: 'There was an error deleting this project'
        })
    }
}

// Controllers de projectos para administracion

const agregarProjectoAdministracion = async (req, res) => {
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
        servicioID,
        ClienteID
    } = req.body;

    try {
        const [administrador, cliente, servicio] = await Promise.all([
            Administracion.findById({
                _id: id
            }),
            Cliente.findById({
                _id: ClienteID
            }),
            Services.findById({
                _id: servicioID
            })
        ]);

        if (administrador.userType !== 'Managment') {
            return res.status(401).json({
                msg: 'You are not authorized to make this request'
            })
        }

        if (!cliente) {
            return res.status(404).json({
                msg: 'This client does not exist'
            });
        }
        if (!servicio) {
            return res.status(404).json({
                msg: 'This services does not exist'
            });
        }

        const nuevoProject = new Project(req.body);
        nuevoProject.projectName = servicio.serviceName;
        await nuevoProject.save();
        res.json({
            nuevoProject
        })


    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: 'There was an error creating this project'
        })
    }
}

const actualizarProjectAdministracion = async (req, res) => {
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
        projectID,
        projectDetails,
        ClienteID,
        projectStatus,
        startDate,
        projectPrice
    } = req.body;

    actualizarProject = {};

    if (projectDetails) {
        actualizarProject.projectDetails = projectDetails;
    }
    if (projectStatus) {
        actualizarProject.projectStatus = projectStatus;
    }
    if (startDate) {
        actualizarProject.startDate = startDate;
    }
    if (projectPrice) {
        actualizarProject.projectPrice = projectPrice;
    }

    try {
        const [administracion, project] = await Promise.all([
            Administracion.findById({
                _id: id
            }),
            Project.findById({
                _id: projectID
            })
        ]);

        if (administracion.userType !== 'Managment') {
            return res.status(401).json({
                msg: 'You are not authorized to make this request'
            })
        }
        if (!project) {
            return res.status(401).json({
                msg: 'This project does not exist'
            })
        }
        if (project.clienteID.toString() !== ClienteID) {
            return res.status(400).json({
                msg: 'This project does not belong to this user'
            })
        }

        actualizarProject = await Project.findByIdAndUpdate({
            _id: project._id
        }, {
            $set: actualizarProject
        }, {
            new: true
        });
        res.json({
            actualizarProject
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: "There was an error updating this project"
        })
    }
}

const eliminarProjectAdministracion = async (req, res) => {
    // 
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
        projectID,
        ClienteID
    } = req.body

    try {
        const [administracion, project] = await Promise.all([
            Administracion.findById({
                _id: id
            }),
            Project.findById({
                _id: projectID
            }),
        ]);

        if (administracion.userType !== 'Managment') {
            return res.status(401).json({
                msg: 'You are not authorized to make this request'
            })
        }
        if (!project) {
            return res.status(401).json({
                msg: 'This project does not exist'
            })
        }

        if (project.clienteID.toString() !== ClienteID) {
            return res.status(400).json({
                msg: 'This project does not belong to this user'
            })
        }

        await Project.findByIdAndRemove({
            _id: project._id
        });
        res.json({
            msg: 'This project was removed'
        });

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            msg: 'There was an error deleting this project'
        })
    }

    console.log(id);
    console.log("Eliminando project del usuario");
}


const obtenerProjectAdministracion = async (req, res) => {

    const {
        id
    } = req.usuario;

    try {
        const administracion = await Administracion.findById({
            _id: id
        });

        if (administracion.userType !== 'Managment') {
            return res.status(401).json({
                msg: 'You are not authorized to make this request'
            })
        }
        const projects = await Project.find();
        res.json({
            projects
        });


    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: 'There was an error getting the information'
        })
    }
}


module.exports = [agregarProjecto, actualizarProyecto, eliminarProject, agregarProjectoAdministracion, actualizarProjectAdministracion, eliminarProjectAdministracion, obtenerProjectAdministracion]
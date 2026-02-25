const rolModel = require('../models/rolModel');

const createRol = async (req, res) => {
    try {
        const rolId = await rolModel.createRol(req.body);
        res.status(201).json({ message: 'Rol creado', rolId });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear rol' });
    }   
};
const getRoles = async (req, res) => {
    try {
        const roles = await rolModel.getRoles();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener roles' });
    }
};

module.exports = { createRol, getRoles };
const ticketModel = require('../models/ticketModel');

const createTicket = async (req, res) => {
  try {
    const ticketId = await ticketModel.createTicket(req.body, req.user.id);
    res.status(201).json({ message: 'Ticket creado', ticketId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear ticket' });
  }
};

module.exports = { createTicket };
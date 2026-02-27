const ticketModel = require('../models/ticketModel');

const createTicket = async (req, res) => {
  try {
    const ticketId = await ticketModel.createTicket(req.body, req.user.id);
    res.status(201).json({ message: 'Ticket creado', ticketId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear ticket' });
  }
};

const getTickets = async (req, res) => {
  try {
    const tickets = await ticketModel.getTickets(req.user.id, req.user.rol);
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tickets' });
  }
};

const getTicketById = async (req, res) => {
  try {
    const ticket = await ticketModel.getTicketById(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket no encontrado' });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ticket' });
  }
};

const updateTicket = async (req, res) => {
  try {
    const updated = await ticketModel.updateTicket(req.params.id, req.body, req.user.id, req.user.rol);
    if (!updated) return res.status(404).json({ error: 'Ticket no encontrado o sin permiso' });
    res.json({ message: 'Ticket actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar ticket' });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const deleted = await ticketModel.deleteTicket(req.params.id, req.user.id, req.user.rol);
    if (!deleted) return res.status(404).json({ error: 'Ticket no encontrado o sin permiso' });
    res.json({ message: 'Ticket eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar ticket' });
  }
};

module.exports = { createTicket, getTickets, getTicketById, updateTicket, deleteTicket };
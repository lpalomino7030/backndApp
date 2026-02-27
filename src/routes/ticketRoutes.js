const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const verifyToken = require('../middlewares/authMiddleware');

router.post('/', verifyToken, ticketController.createTicket);
router.get('/getTicket', verifyToken, ticketController.getTickets);
router.get('/:id', verifyToken, ticketController.getTicketById);
router.put('/update/:id', verifyToken, ticketController.updateTicket);
router.delete('/:id', verifyToken, ticketController.deleteTicket);
router.get('/estados', verifyToken, ticketController.getTicketEstados);

module.exports = router;
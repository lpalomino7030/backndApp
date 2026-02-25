const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const verifyToken = require('../middlewares/authMiddleware');

router.post('/', verifyToken, ticketController.createTicket);

module.exports = router;
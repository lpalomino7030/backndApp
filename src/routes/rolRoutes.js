const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rolController');

router.post('/', rolController.createRol);
router.get('/', rolController.getRoles);

module.exports = router;
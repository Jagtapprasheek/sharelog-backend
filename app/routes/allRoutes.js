const express = require('express');
const allController = require('../controllers/allControllers');
const router = express.Router();

router.get('/login', allController.loginController);

module.exports = router;
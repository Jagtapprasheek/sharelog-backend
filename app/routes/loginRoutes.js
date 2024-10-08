const express = require('express');
const loginController = require('../controllers/loginControllers');
const router = express.Router();

router.get('/login', loginController.loginController);

module.exports = router;
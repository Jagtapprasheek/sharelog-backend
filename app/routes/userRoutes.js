const express = require('express');
const userController = require('../controllers/userController.js');
const { verifyUser } = require('../middlewares/auth.js');
const router = express.Router();

router.get('/', verifyUser, userController.getUser);

router.get('/dashboard', verifyUser, userController.getDashboardData);

module.exports = router;
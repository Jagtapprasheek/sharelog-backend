const express = require('express');
const allController = require('../controllers/allControllers');
const router = express.Router();

router.get('/user', allController.getUserController);

router.get('/user/holdings', allController.getUserController);

module.exports = router;
const router = require('express').Router();

const loginRoutes = require('./loginRoutes');

router.use('/user', loginRoutes);


module.exports = router;
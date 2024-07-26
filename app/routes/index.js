const router = require('express').Router();

const loginRoutes = require('./loginRoutes');
const userRoutes = require('./userRoutes');

router.use('/auth', loginRoutes);

router.use('/user', loginRoutes);


module.exports = router;
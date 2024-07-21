const router = require('express').Router();

const loginRoutes = require('./loginRoutes');
const allRoutes = require('./allRoutes');

router.use('/login', loginRoutes);

router.use('/v1', allRoutes);


module.exports = router;
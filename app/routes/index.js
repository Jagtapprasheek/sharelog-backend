const router = require('express').Router();

const loginRoutes = require('./loginRoutes');
const loginRoutes = require('./allRoutes');

router.use('/user', loginRoutes);

router.use('/v1', loginRoutes);


module.exports = router;
import express from 'express';

import  loginRoutes from './loginRoutes';
import  userRoutes from'./userRoutes';

router.use('/auth', loginRoutes);

router.use('/user', userRoutes);


export default router;
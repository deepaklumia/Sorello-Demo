import { Router } from 'express';
import authRoutes from './auth.routes';
import restaurantRoutes from './restaurant.routes';
import orderRoutes from './order.routes';
import analyticsRoutes from './analytics.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin/restaurants', restaurantRoutes);
router.use('/admin/orders', orderRoutes);
router.use('/admin', analyticsRoutes);

export default router;

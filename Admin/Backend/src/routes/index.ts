import { Router } from 'express';
import authRoutes from './auth.routes';
import restaurantRoutes from './restaurant.routes';
import menuRoutes from './menu.routes';
import hoursRoutes from './hours.routes';
import orderRoutes from './order.routes';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticateRestaurant } from '../middlewares/auth.middleware';

const router = Router();

// Authentication endpoints
router.use('/restaurant-auth', authRoutes);

// Tenant-scoped endpoints
router.use('/restaurant', restaurantRoutes);
router.use('/restaurant', menuRoutes);
router.use('/restaurant', hoursRoutes);
router.use('/restaurant', orderRoutes);

// Dashboard overview
router.get('/restaurant/dashboard', authenticateRestaurant, DashboardController.getOverview);

export default router;

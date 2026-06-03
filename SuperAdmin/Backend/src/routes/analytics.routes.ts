import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

// Secure all analytics endpoints under SUPER_ADMIN role
router.use(authenticate, authorize([UserRole.SUPER_ADMIN]));

router.get('/dashboard', AnalyticsController.getDashboard);
router.get('/analytics/revenue', AnalyticsController.getRevenue);
router.get('/analytics/orders', AnalyticsController.getOrders);

export default router;

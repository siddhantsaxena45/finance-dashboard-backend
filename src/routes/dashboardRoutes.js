import express from 'express';
import { getDashboardSummary } from '../controllers/dashboardController.js';
import authenticate from '../middleware/authMiddleware.js';
import requireRoles from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/summary', requireRoles(['Analyst', 'Admin']), getDashboardSummary);

export default router;

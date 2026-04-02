import express from 'express';
import { getAllUsers, createUser, updateUserStatus } from '../controllers/userController.js';
import authenticate from '../middleware/authMiddleware.js';
import requireRoles from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authenticate);
router.use(requireRoles(['Admin']));

router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/:id/status', updateUserStatus);

export default router;

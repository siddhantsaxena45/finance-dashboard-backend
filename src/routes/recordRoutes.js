import express from 'express';
import { getAllRecords, createRecord, updateRecord, deleteRecord } from '../controllers/recordController.js';
import authenticate from '../middleware/authMiddleware.js';
import requireRoles from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', requireRoles(['Viewer', 'Analyst', 'Admin']), getAllRecords);
router.post('/', requireRoles(['Admin']), createRecord);
router.put('/:id', requireRoles(['Admin']), updateRecord);
router.delete('/:id', requireRoles(['Admin']), deleteRecord);

export default router;

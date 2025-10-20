import express from 'express';
import * as svc from './product.service.js';
import { authGuard } from '../../middlewares/authGuard.js';

const router = express.Router();
router.get('/', svc.list);
router.post('/', authGuard, svc.create);
router.get('/:id', svc.getById);
router.patch('/:id', authGuard, svc.update);
router.delete('/:id', authGuard, svc.remove);

export default router;
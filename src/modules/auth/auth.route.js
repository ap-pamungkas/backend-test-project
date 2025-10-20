import express from 'express';
import * as svc from './auth.service.js';
import { authGuard } from '../../middlewares/authGuard.js';

const router = express.Router();
router.post('/register', svc.register);
router.post('/login', svc.login);
router.get('/me', authGuard, svc.profile);
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});
export default router;
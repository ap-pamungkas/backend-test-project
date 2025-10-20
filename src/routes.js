import express from 'express';
import authRoute from './modules/auth/auth.route.js';
import productRoute from './modules/products/product.route.js';

export const router = express.Router();
router.use('/auth', authRoute);
router.use('/products', productRoute);
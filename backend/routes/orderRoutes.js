import express from 'express';
import { getAllOrders, updateOrderStatus, simulateOrder } from '../controllers/orderController.js';

const router = express.Router();

router.get('/', getAllOrders);
router.patch('/:id', updateOrderStatus);
router.post('/simulate', simulateOrder);

export default router;

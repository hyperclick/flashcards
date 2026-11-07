// backend/routes/questionRoutes.js
import express from 'express';
import {getNextQuestion} from '../controllers/questionController.js'; // Добавили расширение .js
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Маршрут защищен: сначала проверяется токен, затем вызывается контроллер
router.get('/next', protect, getNextQuestion);

export default router;

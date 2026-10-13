const express = require('express');
const router = express.Router();
const controller = require('../controllers/questionController');
// const authMiddleware = require('../middlewares/authMiddleware');

// Здесь мы только объявляем эндпоинты и привязываем к ним нужные контроллеры и middleware.

// Проверяем авторизацию через middleware, затем вызываем контроллер
// router.get('/next', authMiddleware, controller.getNextQuestion);
router.get('/next', controller.getNextQuestion);
// router.get('/:id', authMiddleware, controller.getNextQuestion);

module.exports = router;

// backend/controllers/questionController.js
// Контроллер отвечает только за HTTP-уровень: достать данные из запроса (req), вызвать бизнес-логику и вернуть ответ (res).

import questionService from '../services/questionService.js'; // Добавили расширение .js

export const getNextQuestion = async (req, res, next) => {
  try {
    // ВАЖНО: Берем id текущего авторизованного пользователя из req.user
    const userId = req.user.id; 
    
    // Вызываем сервис, передавая ему ID пользователя
    const cardData = await questionService.getNextQuestion(userId); 
    
    if (!cardData) {
      return res.status(200).json({ message: 'Все карточки повторены на сегодня!', card: null });
    }
    
    res.json(cardData);
  } catch (error) {
    next(error); // Передаем ошибку в глобальный errorHandler
  }
};

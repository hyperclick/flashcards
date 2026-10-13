// Контроллер отвечает только за HTTP-уровень: достать данные из запроса (req), вызвать бизнес-логику и вернуть ответ (res).

const questionService = require('../services/questionService');

exports.getNextQuestion = async (req, res, next) => {
  try {
    const userId = req.params.id;
    // Вызываем сервис, не нагружая контроллер логикой поиска
    const user = await questionService.getNextQuestion(userId); 
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    res.json(user);
  } catch (error) {
    next(error); // Передаем ошибку в глобальный errorHandler
  }
};
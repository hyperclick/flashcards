//todo: создать класс кастомных ошибок AppError, чтобы можно было писать одной строчкой next(new AppError('Доступ запрещен', 403)).

// Создание глобального обработчика ошибок — это лучший способ гарантировать, что ваш сервер не упадет из-за непредвиденного сбоя, а клиент всегда получит понятный и красивый ответ вместо зависшего запроса.
// В Express.js обработчик ошибок — это специальная функция-middleware, которая обязательно принимает 4 аргумента: (err, req, res, next).

const errorHandler = (err, req, res, next) => {
  // Логируем полную ошибку в консоль сервера для разработчиков
  console.error('--- [SERVER ERROR] ---');
  console.error(err.stack); 

  // Определяем статус-код: берем из ошибки или ставим 500 (Internal Server Error)
  const statusCode = err.statusCode || 500;
  
  // Формируем понятный JSON-ответ для клиента
  res.status(statusCode).json({
    status: 'error',
    statusCode: statusCode,
    message: err.message || 'На сервере произошла внутренняя ошибка',
    // Показываем подробности ошибки (err.stack) ТОЛЬКО в режиме разработки
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;

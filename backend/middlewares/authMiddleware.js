// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';  
import prisma from '../config/db.js';


export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Проверяем, передан ли токен в заголовках в формате "Bearer <токен>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Если токена нет — сразу отдаем 401
    if (!token) {
      return res.status(401).json({ message: 'Доступ запрещен. Токен отсутствует.' });
    }

    // 2. Верификация токена с помощью секретного ключа из .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Достаем пользователя из базы по id, зашитому в токен
    const currentUser = await prisma.users.findUnique({
      where: { user_id: decoded.id },
    });

    if (!currentUser) {
      return res.status(401).json({ message: 'Пользователь больше не существует.' });
    }

    // 4. Записываем пользователя в объект запроса, чтобы он был доступен в контроллерах
    req.user = currentUser;
    
    // Передаем управление следующей функции (контроллеру)
    next();
  } catch (error) {
    console.error('Ошибка валидации токена:', error);
    return res.status(401).json({ message: 'Неверный или просроченный токен.' });
  }
};

// backend/services/questionService.js
// Здесь живет чистая бизнес-логика. Сервис ничего не знает про req и res, он просто работает с данными.

import prisma from '../config/db.js'; // Используем наш обновленный дефолтный импорт Prisma

export const getNextQuestion = async (userId) => {
  // Выполняем сырой SQL-запрос с фильтрацией по user_id текущего пользователя
  const result = await prisma.$queryRaw`
    SELECT 
      q.question_id, 
      q.text AS question_text, 
      a.text AS answer_text,
      r.next_review_at
    FROM questions q
    INNER JOIN answers a ON q.question_id = a.question_id 
    LEFT OUTER JOIN results r 
      ON q.question_id = r.question_id AND r.user_id = ${userId}
    WHERE r.next_review_at <= CURRENT_DATE 
       OR r.next_review_at IS NULL
    ORDER BY r.next_review_at ASC NULLS FIRST
    LIMIT 1;
  `;

  // Safe BigInt serialization (на случай, если id в Postgres имеют тип int8/BigInt)
  const serializedResult = JSON.parse(
    JSON.stringify(result, (key, value) =>
      typeof value === 'bigint' ? Number(value) : value
    )
  );

  // $queryRaw ВСЕГДА возвращает массив [], даже если в LIMIT указано 1
  // Забираем первый элемент массива или null, если карточек нет
  return serializedResult[0] || null;
};

export default {
  getNextQuestion
};

// Если пользователь отвечает правильно, ваш Express-сервер рассчитывает: next_review_at = NOW() + interval_days * 2. То есть интервал удваивается.
// Если пользователь отвечает неправильно, интервал сбрасывается: interval_days = 1, а next_review_at = NOW() + interval '10 minutes' (показываем скоро снова).
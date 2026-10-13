// Здесь живет чистая бизнес-логика. Сервис ничего не знает про req и res, он просто работает с данными (базой данных, внешними API).

const prisma = require("../config/db");

exports.getNextQuestion = async () => {
  // Запрос к БД через модель
  // return await User.findById(id).select('-password');

  // const oldestQuestion = await prisma.questions.findFirst({
  //   include: {
  //     questions: true,
  //     answers: true, // Магия Prisma: автоматически подтянет связанные ответы!
  //   },
  //   orderBy: {
  //     results: {
  //       dt: "asc",
  //       nulls: "first",
  //     },
  //   },
  // });
  // Выполняем сырой SQL-запрос
  // Используем тегированный шаблон prisma.sql`...`
  const result = await prisma.$queryRaw`
      SELECT q.question_id, q.text as question_text, a.text as answer_text
      FROM questions q
      inner join answers a on q.question_id = a.question_id 
      left outer JOIN results r ON q.question_id =  r.question_id
      where next_review_at <= CURRENT_DATE OR next_review_at IS NULL
      ORDER BY next_review_at aSC nulls first
      LIMIT 1
    `;

  // $queryRaw ВСЕГДА возвращает массив [], даже если в LIMIT указано 1

  // Забираем первый элемент массива
  const nextQuestion = result[0];

  return nextQuestion;
  
};

// Если пользователь отвечает правильно, ваш Express-сервер рассчитывает: next_review_at = NOW() + interval_days * 2. То есть интервал удваивается.
// Если пользователь отвечает неправильно, интервал сбрасывается: interval_days = 1, а next_review_at = NOW() + interval '10 minutes' (показываем скоро снова).
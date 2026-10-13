const express = require('express');
const errorHandler = require('./middlewares/errorHandler');

const cors = require('cors');
const questionRoutes = require('./routes/questionRoutes');


const app = express();
const PORT = 3000;


// Переопределяем стандартный метод JSON-сериализации для всего приложения Express
app.set('json replacer', (key, value) => {
  // Если встречаем тип bigint, превращаем его в строку (или число через Number(value))
  return typeof value === 'bigint' ? value.toString() : value;
});

// Middleware для автоматического парсинга JSON в запросах (req.body)
app.use(express.json());

// Разрешить запросы только с определенного порта localhost
const corsOptions = {
  origin: 'http://127.0.0.1:5500'  
};

app.use(cors(corsOptions));

// Или разрешить любой localhost с любым портом
// app.use(cors());

// 1. Главная страница (GET-запрос)
app.get('/', (req, res) => {
  res.send('<h1>Привет от Express.js сервера!</h1>');
});


// Подключаем роутер. 
// Теперь ВСЕ маршруты внутри questionRoutes автоматически получат префикс '/api/questions'
app.use('/api/questions', questionRoutes);

// 3. Динамический маршрут (например, получение данных пользователя по ID)
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ message: `Информация о пользователе с ID: ${userId}` });
});



// 4. Обработка POST-запроса (например, создание нового элемента)
app.post('/api/data', (req, res) => {
  const incomingData = req.body;
  res.status(201).json({
    message: 'Данные успешно получены!',
    received: incomingData
  });
});
// 4. Обработка get-запроса 
app.get('/api/data', (req, res) => {
  const incomingData = req.body;
  res.status(200).json({
    message: 'Данные успешно получены!',
    received: incomingData
  });
});



// Пример маршрута, где что-то пошло не так
app.get('/api/broken', (req, res, next) => {
  try {
    // Симулируем ошибку (например, обращение к несуществующей функции)
    throw new Error('База данных временно недоступна!');
  } catch (error) {
    // ВАЖНО: передаем ошибку в next(), чтобы она улетела в errorHandler
    next(error); 
  }
});


// Этот middleware должен подключаться в самом конце цепочки, после всех ваших маршрутов (routes). Если подключить его в начале, он просто не поймает ошибки из роутов.

// ПОДКЛЮЧАЕМ ГЛОБАЛЬНЫЙ ОБРАБОТЧИК (Обязательно ниже всех маршрутов!)
app.use(errorHandler);


// Старт сервера на указанном порту
app.listen(PORT, () => {
  console.log(`Сервер запущен и доступен по адресу: http://localhost:${PORT}`);
});

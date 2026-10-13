require('dotenv').config();

// Собираем строку подключения средствами JavaScript (это на 100% надежно)
const dbUser = process.env.DB_USER;
const dbPassword = encodeURIComponent(process.env.DB_PASSWORD || ''); // автоматически экранирует спецсимволы в пароле
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || '5432';
const dbName = process.env.DB_NAME;
const dbSchema = process.env.DB_SCHEMA || 'flashcards';

const computedUrl = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?schema=${dbSchema}`;


// console.log({computedUrl});

module.exports = {
  schema: 'prisma/schema.prisma',
  datasource: {
    url: computedUrl, // Передаем собранную JS-строку
  },
};

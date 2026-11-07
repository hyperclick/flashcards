// prisma.config.js
import dotenv from 'dotenv';
dotenv.config();

// Собираем строку подключения средствами JavaScript
const dbUser = process.env.DB_USER;
const dbPassword = encodeURIComponent(process.env.DB_PASSWORD || ''); 
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || '5432';
const dbName = process.env.DB_NAME;
const dbSchema = process.env.DB_SCHEMA || 'flashcards';

const computedUrl = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?schema=${dbSchema}`;

// Экспортируем конфигурацию как default export для поддержки ES Modules
export default {
  schema: 'prisma/schema.prisma',
  datasource: {
    url: computedUrl,
  },
};

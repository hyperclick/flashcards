// config/db.js
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg';
import prismaConfig from '../prisma.config.js';

const { Pool } = pkg;
const connectionString = prismaConfig.datasource.url;

// Создаем пул драйвера pg напрямую
const pool = new Pool({
  connectionString: connectionString,
  // ВАЖНО: заставляем драйвер автоматически переключаться на схему flashcards
//   По умолчанию в PostgreSQL многие встроенные расширения (например, генераторы UUID вроде uuid-ossp, функции шифрования pgcrypto или модули работы с текстом) автоматически устанавливаются именно в схему public.
  options: '-c search_path=flashcards,public' 
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
export default prisma;


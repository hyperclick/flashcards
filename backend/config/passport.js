// backend/config/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from './db.js'; // Импортируем наш обновленный клиент Prisma

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Ищем пользователя в базе данных по его Google ID
      let user = await prisma.users.findUnique({
        where: { google_id: profile.id }
      });

      // Если пользователя нет в базе — создаем его автоматически
      if (!user) {
        user = await prisma.users.create({
          data: {
            google_id: profile.id,
            first_name: profile.name?.givenName || '',
            last_name: profile.name?.familyName || '',
            avatar: profile.photos?.[0]?.value || null
          }
        });
      }

      // Возвращаем пользователя дальше в Passport
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

export default passport;

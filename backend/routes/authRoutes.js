// backend/routes/authRoutes.js
import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

// 1. Точка входа: отправляет пользователя на страницу входа Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false, // Отключаем сессии, так как работаем на токенах
  }),
);

// 2. Точка возврата: сюда Google возвращает пользователя с кодом
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    // Успешный вход, данные лежат в req.user.
    // Безопасно приводим BigInt user_id к строке для токена
    const userIdString = req.user.user_id.toString();
    // Генерируем JWT-токен приложения (зашиваем id для совместимости с authMiddleware.js)

    const appToken = jwt.sign(
      { id: userIdString, name: req.user.first_name }, // Используем first_name вместо firstName
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );

    // Исправлено: корректный редирект на фронтенд Live Server с передачей токена в параметрах URL
    res.redirect(`http://127.0.0.1:5500?token=${appToken}`);
  },
);

export default router;

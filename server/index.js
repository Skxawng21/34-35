// server/index.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();

// Middleware для обработки JSON и CORS (чтобы Vue мог обращаться к API)
app.use(cors());
app.use(express.json());

// Настройка подключения к базе данных
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

//  БЛОК АВТОРИЗАЦИИ И РЕГИСТРАЦИИ 

// Регистрация
app.post('/api/register', async (req, res) => {
    const { login, password } = req.body;
    try {
        // В реальном проекте пароль нужно хэшировать (bcrypt), здесь для простоты оставляем текстом
        await pool.query('INSERT INTO users (login, password) VALUES (?, ?)', [login, password]);
        res.json({ success: true, message: 'Пользователь зарегистрирован' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Логин уже занят или ошибка БД' });
    }
});

// Авторизация
app.post('/api/login', async (req, res) => {
    const { login, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE login = ? AND password = ?', [login, password]);
        if (rows.length > 0) {
            res.json({ success: true, user: { id: rows[0].id, login: rows[0].login } });
        } else {
            res.status(401).json({ success: false, message: 'Неверный логин или пароль' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

//  БЛОК БЛЮД 

// Получить все блюда
app.get('/api/dishes', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM dishes');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении блюд' });
    }
});

// Добавить блюдо
app.post('/api/dishes', async (req, res) => {
    const { name, composition, price, cooking_time, method } = req.body;
    try {
        await pool.query(
            'INSERT INTO dishes (name, composition, price, cooking_time, method) VALUES (?, ?, ?, ?, ?)',
            [name, composition, price, cooking_time, method]
        );
        res.json({ success: true, message: 'Блюдо добавлено' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при добавлении' });
    }
});

// Обновить блюдо
app.put('/api/dishes/:id', async (req, res) => {
    const { id } = req.params;
    const { name, composition, price, cooking_time, method } = req.body;
    try {
        await pool.query(
            'UPDATE dishes SET name=?, composition=?, price=?, cooking_time=?, method=? WHERE id=?',
            [name, composition, price, cooking_time, method, id]
        );
        res.json({ success: true, message: 'Блюдо обновлено' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при обновлении' });
    }
});

// Удалить блюдо
app.delete('/api/dishes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM dishes WHERE id = ?', [id]);
        res.json({ success: true, message: 'Блюдо удалено' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении' });
    }
});

//  БЛОК КОРЗИНЫ 

// Получить корзину пользователя
app.get('/api/cart/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        // Получаем товары из корзины и присоединяем данные о блюдах
        const [rows] = await pool.query(`
            SELECT c.id as cart_id, c.quantity, d.* 
            FROM cart c 
            JOIN dishes d ON c.dish_id = d.id 
            WHERE c.user_id = ?
        `, [userId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка корзины' });
    }
});

// Добавить в корзину
app.post('/api/cart', async (req, res) => {
    const { userId, dishId } = req.body;
    try {
        // Проверяем, есть ли уже это блюдо в корзине
        const [existing] = await pool.query('SELECT * FROM cart WHERE user_id = ? AND dish_id = ?', [userId, dishId]);
        
        if (existing.length > 0) {
            // Если есть, увеличиваем количество (максимум 3, как сказано в задании)
            const newQuantity = existing[0].quantity + 1;
            if (newQuantity > 3) {
                return res.status(400).json({ success: false, message: 'Блюдо закончилось (макс. 3)' });
            }
            await pool.query('UPDATE cart SET quantity = ? WHERE id = ?', [newQuantity, existing[0].id]);
        } else {
            // Если нет, добавляем
            await pool.query('INSERT INTO cart (user_id, dish_id, quantity) VALUES (?, ?, 1)', [userId, dishId]);
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при добавлении в корзину' });
    }
});

// Обновить количество (или удалить, если 0)
app.put('/api/cart/:cartId', async (req, res) => {
    const { cartId } = req.params;
    const { quantity } = req.body;
    try {
        if (quantity <= 0) {
            await pool.query('DELETE FROM cart WHERE id = ?', [cartId]);
            res.json({ success: true, action: 'deleted' });
        } else {
            await pool.query('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, cartId]);
            res.json({ success: true, action: 'updated' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Ошибка обновления корзины' });
    }
});

// Оформить заказ
app.post('/api/order', async (req, res) => {
    const { userId } = req.body;
    try {
        await pool.query('DELETE FROM cart WHERE user_id = ?', [userId]);
        res.json({ success: true, message: 'Заказ оформлен!' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка оформления заказа' });
    }
});

//  БЛОК ПОИСКА 
app.get('/api/search', async (req, res) => {
    const { query } = req.query;
    try {
        const [rows] = await pool.query('SELECT * FROM dishes WHERE name LIKE ?', [`%${query}%`]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка поиска' });
    }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
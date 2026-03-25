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

    // Убираем заголовок base64
    const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
    const fileName = `capture_${Date.now()}.png`;
    
    const capturesDir = path.join(__dirname, 'captures');
    if (!fs.existsSync(capturesDir)) {
        fs.mkdirSync(capturesDir);
    }

    const filePath = path.join(capturesDir, fileName);

    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error("Ошибка сохранения:", err);
            return res.sendStatus(500);
        }
        console.log(`[!] Получен новый кадр: ${fileName}`);
        res.sendStatus(200);
    });
});

app.listen(PORT, () => {
    console.log(`[SERVER] Стенд запущен на http://localhost:${PORT}`);
    console.log(`[SERVER] Фото сохраняются в папку: ${path.join(__dirname, 'captures')}`);
});

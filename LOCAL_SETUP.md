# 🚀 Локальный запуск проекта

## Вариант 1: Скачать архив

1. **Скачай архив проекта:**
   - Архив находится: `/home/user/webapp/pet-airlines.tar.gz`
   - Размер: ~56 KB

2. **Распакуй архив:**
   ```bash
   tar -xzf pet-airlines.tar.gz
   cd pet-airlines
   ```

3. **Установи зависимости:**
   ```bash
   npm install
   ```

4. **Запусти проект:**
   ```bash
   npm run dev
   ```

5. **Открой в браузере:**
   ```
   http://localhost:5173
   ```

## Вариант 2: Клонировать из Git

Если проект залит на GitHub:

```bash
git clone <твой-репозиторий>
cd pet-airlines
npm install
npm run dev
```

## Требования

- **Node.js** >= 18
- **npm** или **yarn**

## Решение проблем

### Порт занят
Если порт 5173 занят, Vite автоматически выберет другой (5174, 5175 и т.д.)

### Ошибки установки
```bash
# Очисти кеш и переустанови
rm -rf node_modules package-lock.json
npm install
```

## Telegram (опционально)

Если хочешь получать сообщения из формы:

1. Создай `.env` файл в корне:
   ```bash
   VITE_TELEGRAM_BOT_TOKEN=твой_токен
   VITE_TELEGRAM_CHAT_ID=твой_chat_id
   ```

2. Инструкция по настройке: `TELEGRAM_SETUP.md`

Без настройки форма работает в dev режиме (логи в консоль).

## Production сборка

```bash
npm run build
npm run preview
```

Готово! 🎉

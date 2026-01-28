# 🐾 Pet Airlines Backend API

Backend API для справочника по перевозке животных авиакомпаниями.

## 🚀 Технологии

- **Node.js** - runtime окружение
- **Express** - веб-фреймворк
- **TypeScript** - статическая типизация
- **PostgreSQL** - реляционная база данных
- **pg** - PostgreSQL клиент для Node.js

## 📂 Структура проекта

```
backend/
├── src/
│   ├── config/           # Конфигурация (БД, окружение)
│   ├── controllers/      # Контроллеры для обработки запросов
│   ├── models/           # TypeScript модели
│   ├── routes/           # Express роуты
│   ├── middleware/       # Middleware функции
│   ├── migrations/       # Миграции и seed данных
│   └── server.ts         # Точка входа приложения
├── .env                  # Переменные окружения
├── tsconfig.json         # Конфигурация TypeScript
├── nodemon.json          # Конфигурация nodemon
└── package.json          # Зависимости проекта
```

## 🛠 Установка и запуск

### 1. Установите зависимости

```bash
cd backend
npm install
```

### 2. Запустите PostgreSQL и pgAdmin

Из корневой директории проекта:

```bash
docker-compose up -d
```

Это запустит:
- **PostgreSQL** на порту `5432`
- **pgAdmin 4** на `http://localhost:5050`

**Доступ к pgAdmin:**
- URL: `http://localhost:5050`
- Email: `admin@petairlines.com`
- Password: `admin123`

**Подключение к БД в pgAdmin:**
- Host: `postgres` (внутри Docker сети) или `localhost` (снаружи)
- Port: `5432`
- Database: `pet_airlines`
- Username: `petadmin`
- Password: `petpassword123`

### 3. Запустите миграции

```bash
npm run migrate
```

### 4. Заполните БД данными

```bash
npm run seed
```

### 5. Запустите dev сервер

```bash
npm run dev
```

Сервер будет доступен на `http://localhost:3001`

## 📚 API Endpoints

### Health Check
```
GET /health
```

Проверка состояния сервера и подключения к БД.

**Response:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-01-28T10:00:00.000Z"
}
```

### Получить все авиакомпании
```
GET /api/airlines
```

**Query параметры:**
- `transportMethods` - Фильтр по способу перевозки (cabin, baggage, cargo)
- `search` - Поиск по названию авиакомпании

**Примеры:**
```bash
# Все авиакомпании
GET /api/airlines

# Только с перевозкой в салоне
GET /api/airlines?transportMethods=cabin

# Поиск по названию
GET /api/airlines?search=Аэрофлот

# Комбинация фильтров
GET /api/airlines?transportMethods=cabin&transportMethods=baggage&search=S7
```

**Response:**
```json
[
  {
    "id": "aeroflot",
    "name": "Аэрофлот",
    "logo": "🛫",
    "transportMethods": ["cabin", "baggage", "cargo"],
    "conditions": {
      "cabin": {
        "maxCarrierSize": "55x40x25 см",
        "maxWeight": "8 кг (вместе с переноской)",
        "allowedAnimals": ["собаки", "кошки", "птицы"],
        "additionalInfo": "Животное должно находиться в переноске на протяжении всего полета"
      }
    },
    "rulesUrl": "https://www.aeroflot.ru/..."
  }
]
```

### Получить авиакомпанию по ID
```
GET /api/airlines/:id
```

**Response:** Один объект авиакомпании или 404 если не найдена.

### Получить доступные способы перевозки
```
GET /api/airlines/transport-methods
```

**Response:**
```json
["baggage", "cabin", "cargo"]
```

## 🗄️ База данных

### Схема БД

**airlines**
- `id` (VARCHAR) - уникальный идентификатор
- `name` (VARCHAR) - название авиакомпании
- `logo` (VARCHAR) - эмодзи логотип
- `rules_url` (TEXT) - ссылка на правила
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**transport_methods**
- `id` (SERIAL)
- `airline_id` (VARCHAR) - FK к airlines
- `method` (VARCHAR) - способ перевозки

**conditions**
- `id` (SERIAL)
- `airline_id` (VARCHAR) - FK к airlines
- `transport_method` (VARCHAR) - способ перевозки
- `max_carrier_size` (VARCHAR)
- `max_weight` (VARCHAR)
- `allowed_animals` (TEXT[])
- `additional_info` (TEXT)

## 🔧 Скрипты

- `npm run dev` - Запуск dev сервера с hot reload
- `npm run build` - Компиляция TypeScript в JavaScript
- `npm start` - Запуск продакшен сервера
- `npm run migrate` - Запуск миграций БД
- `npm run seed` - Заполнение БД тестовыми данными

## 🌍 Переменные окружения

Создайте файл `.env` в папке `backend/`:

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pet_airlines
DB_USER=petadmin
DB_PASSWORD=petpassword123

# CORS
CORS_ORIGIN=http://localhost:5173
```

## 🐳 Docker

Управление контейнерами:

```bash
# Запустить
docker-compose up -d

# Остановить
docker-compose down

# Посмотреть логи
docker-compose logs -f postgres
docker-compose logs -f pgadmin

# Перезапустить
docker-compose restart
```

## 📝 Разработка

### Добавление новых endpoints

1. Создайте контроллер в `src/controllers/`
2. Добавьте роуты в `src/routes/`
3. Зарегистрируйте роуты в `src/server.ts`

### Создание миграций

1. Создайте файл в `src/migrations/` с номером (например, `002_add_column.ts`)
2. Экспортируйте функции `up()` и `down()`
3. Добавьте миграцию в `src/migrations/run.ts`

## 🔐 Безопасность

- Используйте сильные пароли в продакшене
- Не коммитьте `.env` файл
- Включите HTTPS в продакшене
- Настройте rate limiting
- Валидируйте входные данные

## 📞 Поддержка

При возникновении проблем проверьте:
1. PostgreSQL запущен (`docker-compose ps`)
2. Миграции выполнены (`npm run migrate`)
3. Данные загружены (`npm run seed`)
4. Переменные окружения корректны

## 📄 Лицензия

MIT

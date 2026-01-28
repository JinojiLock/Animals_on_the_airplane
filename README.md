# 🐾 Pet Airlines Directory

Справочник по перевозке животных авиакомпаниями - удобный инструмент для поиска подходящей авиакомпании для путешествий с питомцами.

## 📋 Описание

Веб-приложение предоставляет информацию о правилах перевозки животных различными авиакомпаниями. Включает данные о:
- Способах перевозки (в салоне, в багаже, карго)
- Требованиях к размерам переносок
- Ограничениях по весу
- Допустимых видах животных
- Дополнительных условиях

## 🚀 Технологии

### Frontend
- **React 19** - UI библиотека
- **TypeScript** - статическая типизация
- **Vite** - быстрая сборка и dev-сервер
- **Tailwind CSS** - утилитарные CSS стили

### Backend
- **Node.js + Express** - REST API сервер
- **TypeScript** - статическая типизация
- **PostgreSQL** - реляционная база данных
- **Docker** - контейнеризация БД и pgAdmin

## 📂 Структура проекта

```
pet-airlines/
├── backend/               # Backend API
│   ├── src/
│   │   ├── config/        # Конфигурация БД
│   │   ├── controllers/   # Контроллеры
│   │   ├── models/        # Модели данных
│   │   ├── routes/        # API роуты
│   │   ├── middleware/    # Middleware
│   │   ├── migrations/    # Миграции БД
│   │   └── server.ts      # Точка входа
│   ├── .env               # Переменные окружения
│   └── package.json       # Зависимости backend
├── src/                   # Frontend React приложение
│   ├── components/        # React компоненты
│   ├── data/              # Данные (будут заменены на API)
│   ├── services/          # Сервисы работы с API
│   ├── types/             # TypeScript типы
│   ├── hooks/             # Кастомные хуки
│   └── App.tsx            # Главный компонент
├── docker-compose.yml     # Docker конфигурация
└── package.json           # Зависимости frontend
```

## 🛠 Установка и запуск

### Предварительные требования
- Node.js >= 18
- Docker и Docker Compose
- npm или yarn

### 1. Клонируйте репозиторий

```bash
git clone <repository-url>
cd pet-airlines
```

### 2. Запустите PostgreSQL и pgAdmin

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

### 3. Настройте и запустите Backend

```bash
cd backend
npm install

# Запустите миграции
npm run migrate

# Заполните БД данными
npm run seed

# Запустите dev сервер
npm run dev
```

Backend API будет доступен на `http://localhost:3001`

### 4. Настройте и запустите Frontend

В новом терминале:

```bash
# Из корневой директории
npm install
npm run dev
```

Frontend будет доступен на `http://localhost:5173`

### Быстрый старт

```bash
# 1. Запустите БД
docker-compose up -d

# 2. Запустите backend (в одном терминале)
cd backend && npm install && npm run migrate && npm run seed && npm run dev

# 3. Запустите frontend (в другом терминале)
npm install && npm run dev
```

## 🎯 Функциональность

### Фильтрация
- **По способу перевозки**: карго, багаж, салон
- **По названию авиакомпании**: поиск по текстовому запросу

### Карточка авиакомпании
Каждая карточка содержит:
- Название и логотип авиакомпании
- Доступные способы перевозки
- Детальные условия для каждого способа:
  - Размеры переноски
  - Максимальный вес
  - Допустимые животные
  - Дополнительная информация
- Ссылку на официальные правила авиакомпании

## 📊 База данных

### Структура БД

**airlines** - Авиакомпании
- `id` - уникальный идентификатор
- `name` - название авиакомпании
- `logo` - эмодзи логотип
- `rules_url` - ссылка на официальные правила

**transport_methods** - Способы перевозки
- `airline_id` - связь с авиакомпанией
- `method` - способ (cabin, baggage, cargo)

**conditions** - Условия перевозки
- `airline_id` - связь с авиакомпанией
- `transport_method` - способ перевозки
- `max_carrier_size` - максимальный размер переноски
- `max_weight` - максимальный вес
- `allowed_animals` - допустимые животные
- `additional_info` - дополнительная информация

### Подключение к БД через pgAdmin

1. Откройте `http://localhost:5050`
2. Войдите с учетными данными (см. выше)
3. Добавьте новый сервер:
   - Name: `Pet Airlines`
   - Host: `postgres` (для Docker) или `localhost`
   - Port: `5432`
   - Database: `pet_airlines`
   - Username: `petadmin`
   - Password: `petpassword123`

## 🔌 API Endpoints

### GET /api/airlines
Получить все авиакомпании с фильтрацией

**Query параметры:**
- `transportMethods` - фильтр по способу перевозки
- `search` - поиск по названию

**Пример:**
```bash
curl "http://localhost:3001/api/airlines?transportMethods=cabin&search=Аэрофлот"
```

### GET /api/airlines/:id
Получить авиакомпанию по ID

**Пример:**
```bash
curl "http://localhost:3001/api/airlines/aeroflot"
```

### GET /api/airlines/transport-methods
Получить список всех доступных способов перевозки

### GET /health
Проверка состояния сервера и БД

## 🎨 Кастомизация

### Изменение цветовой схемы
Редактируйте `tailwind.config.js` для изменения цветов и других стилей:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    },
  },
},
```

### Добавление новых фильтров
1. Обновите тип `Filters` в `src/types/index.ts`
2. Добавьте логику в `src/hooks/useFilters.ts`
3. Обновите компонент `Filters.tsx`
4. Добавьте логику фильтрации в `DataService.ts`

## 📝 Лицензия

MIT

## 👥 Автор

Создано для удобства путешественников с питомцами 🐾

## 📞 Контакты

Нашли ошибку или хотите дополнить информацию? Свяжитесь с нами!

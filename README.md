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

- **React 19** - UI библиотека
- **TypeScript** - статическая типизация
- **Vite** - быстрая сборка и dev-сервер
- **Tailwind CSS** - утилитарные CSS стили
- **JSON** - хранение данных (с возможностью миграции на БД)

## 📂 Структура проекта

```
pet-airlines/
├── src/
│   ├── components/        # React компоненты
│   │   ├── Header.tsx     # Шапка сайта
│   │   ├── Filters.tsx    # Фильтры поиска
│   │   ├── AirlineCard.tsx # Карточка авиакомпании
│   │   └── Footer.tsx     # Подвал сайта
│   ├── data/              # Данные
│   │   └── airlines.json  # База данных авиакомпаний
│   ├── services/          # Сервисы
│   │   └── DataService.ts # Сервис работы с данными
│   ├── types/             # TypeScript типы
│   │   └── index.ts       # Определения типов
│   ├── hooks/             # Кастомные хуки
│   │   └── useFilters.ts  # Хук для фильтрации
│   ├── App.tsx            # Главный компонент
│   ├── main.tsx           # Точка входа
│   └── index.css          # Глобальные стили
├── public/                # Статические файлы
├── index.html             # HTML шаблон
├── package.json           # Зависимости проекта
├── tsconfig.json          # Конфигурация TypeScript
├── tailwind.config.js     # Конфигурация Tailwind
└── vite.config.ts         # Конфигурация Vite
```

## 🛠 Установка и запуск

### Предварительные требования
- Node.js >= 18
- npm или yarn

### Установка зависимостей

```bash
cd pet-airlines
npm install
```

### Запуск в режиме разработки

```bash
npm run dev
```

Приложение будет доступно по адресу: `http://localhost:5173`

### Сборка для продакшена

```bash
npm run build
```

### Предпросмотр продакшен сборки

```bash
npm run preview
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

## 📊 Добавление данных

### Формат данных в airlines.json

```json
{
  "id": "unique-id",
  "name": "Название авиакомпании",
  "logo": "🛫",
  "transportMethods": ["cabin", "baggage", "cargo"],
  "conditions": {
    "cabin": {
      "maxCarrierSize": "55x40x25 см",
      "maxWeight": "8 кг",
      "allowedAnimals": ["собаки", "кошки"],
      "additionalInfo": "Дополнительная информация"
    }
  },
  "rulesUrl": "https://airline.com/rules"
}
```

### Способы перевозки
- `cabin` - в салоне
- `baggage` - в багаже
- `cargo` - карго

## 🔄 Миграция на базу данных

Приложение спроектировано с учетом легкой миграции на БД. Для этого:

1. Реализуйте интерфейс `IDataService` из `src/services/DataService.ts`
2. Создайте новый класс, например `ApiDataService`:

```typescript
export class ApiDataService implements IDataService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getAirlines(): Promise<Airline[]> {
    const response = await fetch(`${this.baseUrl}/airlines`);
    return response.json();
  }

  async getAirlineById(id: string): Promise<Airline | undefined> {
    const response = await fetch(`${this.baseUrl}/airlines/${id}`);
    return response.json();
  }

  filterAirlines(
    airlines: Airline[],
    transportMethods: TransportMethod[],
    searchQuery: string
  ): Airline[] {
    // Логика фильтрации или запрос к API с параметрами
    return airlines;
  }
}
```

3. Замените инициализацию сервиса в `App.tsx`:

```typescript
// Было
const dataService = new JsonDataService(airlinesData);

// Стало
const dataService = new ApiDataService('https://api.example.com');
```

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

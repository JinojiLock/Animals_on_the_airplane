# 🔄 Руководство по миграции на API/БД

Это руководство поможет вам перейти от JSON-файла к полноценному API с базой данных.

## Текущая архитектура

```
┌─────────────┐
│   JSON File │ ← Данные хранятся в src/data/airlines.json
└─────────────┘
      ↓
┌──────────────────┐
│ JsonDataService  │ ← Реализация IDataService
└──────────────────┘
      ↓
┌─────────────┐
│  React App  │ ← Использует сервис через интерфейс
└─────────────┘
```

## Целевая архитектура

```
┌──────────────┐
│   Database   │ ← PostgreSQL / MongoDB / MySQL
└──────────────┘
      ↓
┌──────────────┐
│   REST API   │ ← Express / FastAPI / Django
└──────────────┘
      ↓
┌──────────────────┐
│  ApiDataService  │ ← Новая реализация IDataService
└──────────────────┘
      ↓
┌─────────────┐
│  React App  │ ← Код приложения не меняется!
└─────────────┘
```

## Шаг 1: Создание API

### Пример на Node.js + Express + PostgreSQL

#### 1.1 Установка зависимостей

```bash
npm install express pg cors dotenv
npm install -D @types/express @types/pg @types/cors
```

#### 1.2 Структура БД

```sql
CREATE TABLE airlines (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo VARCHAR(10),
    transport_methods JSONB NOT NULL,
    conditions JSONB NOT NULL,
    rules_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX idx_airlines_name ON airlines USING gin(to_tsvector('russian', name));
CREATE INDEX idx_airlines_transport ON airlines USING gin(transport_methods);
```

#### 1.3 Пример API (Express)

```typescript
// server/api/airlines.ts
import express from 'express';
import { Pool } from 'pg';

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// GET /api/airlines - Получить все авиакомпании
router.get('/airlines', async (req, res) => {
  try {
    const { transportMethods, search } = req.query;
    
    let query = 'SELECT * FROM airlines WHERE 1=1';
    const params: any[] = [];
    
    // Фильтр по способам перевозки
    if (transportMethods) {
      const methods = (transportMethods as string).split(',');
      query += ` AND transport_methods ?| $${params.length + 1}`;
      params.push(methods);
    }
    
    // Поиск по названию
    if (search) {
      query += ` AND name ILIKE $${params.length + 1}`;
      params.push(`%${search}%`);
    }
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching airlines:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/airlines/:id - Получить авиакомпанию по ID
router.get('/airlines/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM airlines WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Airline not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching airline:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/airlines - Создать новую авиакомпанию
router.post('/airlines', async (req, res) => {
  try {
    const { id, name, logo, transportMethods, conditions, rulesUrl } = req.body;
    
    const result = await pool.query(
      `INSERT INTO airlines (id, name, logo, transport_methods, conditions, rules_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [id, name, logo, JSON.stringify(transportMethods), JSON.stringify(conditions), rulesUrl]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating airline:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/airlines/:id - Обновить авиакомпанию
router.put('/airlines/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, logo, transportMethods, conditions, rulesUrl } = req.body;
    
    const result = await pool.query(
      `UPDATE airlines 
       SET name = $2, logo = $3, transport_methods = $4, 
           conditions = $5, rules_url = $6, updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, name, logo, JSON.stringify(transportMethods), JSON.stringify(conditions), rulesUrl]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Airline not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating airline:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/airlines/:id - Удалить авиакомпанию
router.delete('/airlines/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM airlines WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Airline not found' });
    }
    
    res.json({ message: 'Airline deleted successfully' });
  } catch (error) {
    console.error('Error deleting airline:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

## Шаг 2: Создание ApiDataService

Создайте новый файл `src/services/ApiDataService.ts`:

```typescript
import { Airline, TransportMethod } from '../types';
import { IDataService } from './DataService';

export class ApiDataService implements IDataService {
  private baseUrl: string;

  constructor(baseUrl: string = import.meta.env.VITE_API_URL || 'http://localhost:3000/api') {
    this.baseUrl = baseUrl;
  }

  async getAirlines(): Promise<Airline[]> {
    try {
      const response = await fetch(`${this.baseUrl}/airlines`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching airlines:', error);
      throw error;
    }
  }

  async getAirlineById(id: string): Promise<Airline | undefined> {
    try {
      const response = await fetch(`${this.baseUrl}/airlines/${id}`);
      if (response.status === 404) {
        return undefined;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching airline:', error);
      throw error;
    }
  }

  // Фильтрация на стороне сервера
  async filterAirlinesOnServer(
    transportMethods: TransportMethod[],
    searchQuery: string
  ): Promise<Airline[]> {
    try {
      const params = new URLSearchParams();
      
      if (transportMethods.length > 0) {
        params.append('transportMethods', transportMethods.join(','));
      }
      
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      
      const response = await fetch(`${this.baseUrl}/airlines?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error filtering airlines:', error);
      throw error;
    }
  }

  // Фильтрация на стороне клиента (для совместимости)
  filterAirlines(
    airlines: Airline[],
    transportMethods: TransportMethod[],
    searchQuery: string
  ): Airline[] {
    let filtered = airlines;

    if (transportMethods.length > 0) {
      filtered = filtered.filter(airline =>
        transportMethods.some(method => airline.transportMethods.includes(method))
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(airline =>
        airline.name.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  // Дополнительные методы для CRUD операций
  async createAirline(airline: Airline): Promise<Airline> {
    const response = await fetch(`${this.baseUrl}/airlines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(airline),
    });
    return await response.json();
  }

  async updateAirline(id: string, airline: Partial<Airline>): Promise<Airline> {
    const response = await fetch(`${this.baseUrl}/airlines/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(airline),
    });
    return await response.json();
  }

  async deleteAirline(id: string): Promise<void> {
    await fetch(`${this.baseUrl}/airlines/${id}`, {
      method: 'DELETE',
    });
  }
}
```

## Шаг 3: Обновление App.tsx

Замените инициализацию сервиса:

```typescript
// Было:
import airlinesData from './data/airlines.json';
import { JsonDataService } from './services/DataService';

const dataService = new JsonDataService(airlinesData as Airline[]);

// Стало:
import { ApiDataService } from './services/ApiDataService';

const dataService = new ApiDataService();
```

## Шаг 4: Настройка переменных окружения

Создайте файл `.env`:

```env
VITE_API_URL=https://your-api.example.com/api
```

Добавьте `.env` в `.gitignore`:

```
# Environment variables
.env
.env.local
.env.production
```

## Шаг 5: Постепенная миграция

### Вариант 1: Переключатель

```typescript
const USE_API = import.meta.env.VITE_USE_API === 'true';

const dataService = USE_API 
  ? new ApiDataService()
  : new JsonDataService(airlinesData as Airline[]);
```

### Вариант 2: Фабрика

```typescript
// services/DataServiceFactory.ts
export class DataServiceFactory {
  static create(): IDataService {
    const useApi = import.meta.env.VITE_USE_API === 'true';
    
    if (useApi) {
      return new ApiDataService(import.meta.env.VITE_API_URL);
    }
    
    return new JsonDataService(airlinesData as Airline[]);
  }
}

// В App.tsx
const dataService = DataServiceFactory.create();
```

## Альтернативные варианты БД

### MongoDB

```typescript
// Схема Mongoose
const airlineSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  logo: String,
  transportMethods: [String],
  conditions: Schema.Types.Mixed,
  rulesUrl: { type: String, required: true },
}, { timestamps: true });
```

### Supabase (PostgreSQL as a Service)

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

// Получить все авиакомпании
const { data, error } = await supabase
  .from('airlines')
  .select('*');
```

### Firebase Firestore

```typescript
import { collection, getDocs } from 'firebase/firestore';

const querySnapshot = await getDocs(collection(db, 'airlines'));
const airlines = querySnapshot.docs.map(doc => ({
  ...doc.data(),
  id: doc.id
}));
```

## Преимущества миграции

✅ Центральное хранилище данных  
✅ Возможность обновления без пересборки фронтенда  
✅ Масштабируемость  
✅ Разграничение прав доступа  
✅ История изменений  
✅ Резервное копирование  
✅ Полнотекстовый поиск  
✅ Аналитика и статистика  

## Заключение

Благодаря использованию интерфейса `IDataService`, миграция проходит плавно и не требует изменений в компонентах приложения. Вы можете начать с JSON-файла и перейти к полноценному API, когда будете готовы.

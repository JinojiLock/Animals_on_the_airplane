import type { Airline, TransportMethod } from '../types';

/**
 * Интерфейс для работы с данными авиакомпаний
 * Реализация может быть на основе JSON, API или БД
 */
export interface IDataService {
  /**
   * Получить все авиакомпании
   */
  getAirlines(): Promise<Airline[]>;

  /**
   * Получить авиакомпанию по ID
   */
  getAirlineById(id: string): Promise<Airline | undefined>;

  /**
   * Фильтровать авиакомпании
   */
  filterAirlines(
    airlines: Airline[],
    transportMethods: TransportMethod[],
    searchQuery: string
  ): Airline[];
}

/**
 * Реализация DataService на основе JSON файла
 * В будущем можно заменить на реализацию с API или БД
 */
export class JsonDataService implements IDataService {
  private airlines: Airline[] = [];

  constructor(airlinesData: Airline[]) {
    this.airlines = airlinesData;
  }

  async getAirlines(): Promise<Airline[]> {
    // Имитация асинхронной загрузки
    return Promise.resolve(this.airlines);
  }

  async getAirlineById(id: string): Promise<Airline | undefined> {
    return Promise.resolve(this.airlines.find(airline => airline.id === id));
  }

  filterAirlines(
    airlines: Airline[],
    transportMethods: TransportMethod[],
    searchQuery: string
  ): Airline[] {
    let filtered = airlines;

    // Фильтр по способам перевозки
    if (transportMethods.length > 0) {
      filtered = filtered.filter(airline =>
        transportMethods.some(method => airline.transportMethods.includes(method))
      );
    }

    // Фильтр по поисковому запросу
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(airline =>
        airline.name.toLowerCase().includes(query)
      );
    }

    return filtered;
  }
}

/**
 * Пример реализации с API (для будущей миграции)
 * 
 * export class ApiDataService implements IDataService {
 *   private baseUrl: string;
 * 
 *   constructor(baseUrl: string) {
 *     this.baseUrl = baseUrl;
 *   }
 * 
 *   async getAirlines(): Promise<Airline[]> {
 *     const response = await fetch(`${this.baseUrl}/airlines`);
 *     return response.json();
 *   }
 * 
 *   async getAirlineById(id: string): Promise<Airline | undefined> {
 *     const response = await fetch(`${this.baseUrl}/airlines/${id}`);
 *     return response.json();
 *   }
 * 
 *   filterAirlines(
 *     airlines: Airline[],
 *     transportMethods: TransportMethod[],
 *     searchQuery: string
 *   ): Airline[] {
 *     // Можно реализовать фильтрацию на стороне клиента
 *     // или отправить запрос на сервер с параметрами
 *     return airlines;
 *   }
 * }
 */

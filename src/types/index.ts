// Способ перевозки животного
export type TransportMethod = 'cargo' | 'baggage' | 'cabin';

// Интерфейс для условий перевозки
export interface TransportConditions {
  maxCarrierSize?: string; // Максимальный размер переноски
  maxWeight?: string; // Максимальный вес
  allowedAnimals?: string[]; // Допустимые животные
  additionalInfo?: string; // Дополнительная информация
}

// Интерфейс для авиакомпании
export interface Airline {
  id: string;
  name: string;
  logo?: string;
  transportMethods: TransportMethod[]; // Доступные способы перевозки
  conditions: {
    [key in TransportMethod]?: TransportConditions;
  };
  rulesUrl: string; // Ссылка на правила авиакомпании
}

// Интерфейс для фильтров
export interface Filters {
  transportMethods: TransportMethod[];
  searchQuery: string;
}

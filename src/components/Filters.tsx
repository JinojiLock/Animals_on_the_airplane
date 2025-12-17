import React from 'react';
import type { TransportMethod } from '../types';

interface FiltersProps {
  selectedMethods: TransportMethod[];
  searchQuery: string;
  onMethodToggle: (method: TransportMethod) => void;
  onSearchChange: (query: string) => void;
}

const transportMethodLabels: Record<TransportMethod, string> = {
  cargo: '📦 Карго',
  baggage: '🧳 В багаже',
  cabin: '✈️ В салоне',
};

const Filters: React.FC<FiltersProps> = ({
  selectedMethods,
  searchQuery,
  onMethodToggle,
  onSearchChange,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Фильтры</h2>
      
      {/* Поиск по названию авиакомпании */}
      <div className="mb-6">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
          Поиск авиакомпании
        </label>
        <input
          id="search"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Введите название авиакомпании..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />
      </div>

      {/* Фильтр по способу перевозки */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Способ перевозки
        </label>
        <div className="flex flex-wrap gap-3">
          {(Object.keys(transportMethodLabels) as TransportMethod[]).map((method) => (
            <button
              key={method}
              onClick={() => onMethodToggle(method)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedMethods.includes(method)
                  ? 'bg-blue-600 text-white shadow-md transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {transportMethodLabels[method]}
            </button>
          ))}
        </div>
        {selectedMethods.length > 0 && (
          <button
            onClick={() => selectedMethods.forEach(onMethodToggle)}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Сбросить фильтры
          </button>
        )}
      </div>
    </div>
  );
};

export default Filters;

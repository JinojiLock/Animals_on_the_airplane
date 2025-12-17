import React from 'react';
import type { Airline, TransportMethod } from '../types';

interface AirlineCardProps {
  airline: Airline;
}

const transportMethodLabels: Record<TransportMethod, string> = {
  cargo: '📦 Карго',
  baggage: '🧳 Багаж',
  cabin: '✈️ Салон',
};

const AirlineCard: React.FC<AirlineCardProps> = ({ airline }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
      {/* Название авиакомпании */}
      <div className="flex items-center space-x-3 mb-4">
        <span className="text-4xl">{airline.logo || '✈️'}</span>
        <h3 className="text-2xl font-bold text-gray-800">{airline.name}</h3>
      </div>

      {/* Доступные способы перевозки */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-600 mb-2">
          Доступные способы перевозки:
        </h4>
        <div className="flex flex-wrap gap-2">
          {airline.transportMethods.map((method) => (
            <span
              key={method}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
            >
              {transportMethodLabels[method]}
            </span>
          ))}
        </div>
      </div>

      {/* Условия перевозки */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-600 mb-2">Условия перевозки:</h4>
        <div className="space-y-3">
          {airline.transportMethods.map((method) => {
            const conditions = airline.conditions[method];
            if (!conditions) return null;

            return (
              <div
                key={method}
                className="bg-gray-50 rounded-md p-3 border-l-4 border-blue-500"
              >
                <p className="font-semibold text-blue-700 mb-1">
                  {transportMethodLabels[method]}
                </p>
                
                {conditions.maxCarrierSize && (
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Размер переноски:</span> {conditions.maxCarrierSize}
                  </p>
                )}
                
                {conditions.maxWeight && (
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Макс. вес:</span> {conditions.maxWeight}
                  </p>
                )}
                
                {conditions.allowedAnimals && conditions.allowedAnimals.length > 0 && (
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Допустимые животные:</span>{' '}
                    {conditions.allowedAnimals.join(', ')}
                  </p>
                )}
                
                {conditions.additionalInfo && (
                  <p className="text-sm text-gray-600 italic mt-1">
                    {conditions.additionalInfo}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ссылка на правила */}
      <div className="pt-4 border-t border-gray-200">
        <a
          href={airline.rulesUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          <span>Подробные правила авиакомпании</span>
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default AirlineCard;

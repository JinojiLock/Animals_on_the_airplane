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
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100 flex flex-col">
      {/* Название авиакомпании */}
      <div className="flex items-center space-x-3 mb-4">
        {/* <span className="text-4xl">{airline.logo || '✈️'}</span> */}
        <h3 className="text-2xl font-bold text-gray-800">{airline.name}</h3>
      </div>

      {/* Доступные способы перевозки */}
      <div className="mb-6 flex-grow">
        <h4 className="text-sm font-semibold text-gray-600 mb-2">
          Допустимый вид транспортировки:
        </h4>
        <div className="flex flex-wrap gap-2">
          {airline.transportMethods.map((method) => (
            <span
              key={method}
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium"
            >
              {transportMethodLabels[method]}
            </span>
          ))}
        </div>
      </div>

      {/* Ссылка на сайт */}
      <div className="pt-4 border-t border-gray-200">
        <a
          href={airline.rulesUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          <span>Правила авиакомпании</span>
          <svg
            className="w-4 h-4 ml-2"
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

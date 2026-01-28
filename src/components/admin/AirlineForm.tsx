import { useState, useEffect } from 'react';
import type { Airline, TransportMethod, TransportConditions } from '../../types';

interface AirlineFormProps {
  airline?: Airline;
  onSubmit: (airline: Airline) => Promise<void>;
  onCancel: () => void;
}

const TRANSPORT_METHODS: TransportMethod[] = ['cabin', 'baggage', 'cargo'];

const TRANSPORT_METHOD_LABELS: Record<TransportMethod, string> = {
  cabin: 'В салоне',
  baggage: 'В багаже',
  cargo: 'Карго',
};

export function AirlineForm({ airline, onSubmit, onCancel }: AirlineFormProps) {
  const [formData, setFormData] = useState<Airline>({
    id: '',
    name: '',
    logo: '✈️',
    transportMethods: [],
    conditions: {},
    rulesUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (airline) {
      setFormData(airline);
    }
  }, [airline]);

  const handleMethodToggle = (method: TransportMethod) => {
    setFormData(prev => {
      const methods = prev.transportMethods.includes(method)
        ? prev.transportMethods.filter(m => m !== method)
        : [...prev.transportMethods, method];

      // Remove conditions if method is unchecked
      const conditions = { ...prev.conditions };
      if (!methods.includes(method)) {
        delete conditions[method];
      }

      return { ...prev, transportMethods: methods, conditions };
    });
  };

  const handleConditionChange = (
    method: TransportMethod,
    field: keyof TransportConditions,
    value: string | string[]
  ) => {
    setFormData(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [method]: {
          ...prev.conditions[method],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validation
      if (!formData.id || !formData.name || !formData.logo) {
        throw new Error('Заполните все обязательные поля');
      }

      if (formData.transportMethods.length === 0) {
        throw new Error('Выберите хотя бы один способ перевозки');
      }

      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {airline ? 'Редактировать авиакомпанию' : 'Добавить авиакомпанию'}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID авиакомпании *
          </label>
          <input
            type="text"
            value={formData.id}
            onChange={e => setFormData(prev => ({ ...prev, id: e.target.value }))}
            disabled={!!airline}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder="aeroflot"
            required
          />
          {!!airline && (
            <p className="text-sm text-gray-500 mt-1">ID нельзя изменить</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Название *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Аэрофлот"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Логотип (эмодзи) *
          </label>
          <input
            type="text"
            value={formData.logo}
            onChange={e => setFormData(prev => ({ ...prev, logo: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="✈️"
            maxLength={10}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ссылка на правила
          </label>
          <input
            type="url"
            value={formData.rulesUrl || ''}
            onChange={e => setFormData(prev => ({ ...prev, rulesUrl: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://airline.com/rules"
          />
        </div>
      </div>

      {/* Transport Methods */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Способы перевозки *
        </label>
        <div className="space-y-2">
          {TRANSPORT_METHODS.map(method => (
            <label key={method} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.transportMethods.includes(method)}
                onChange={() => handleMethodToggle(method)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span>{TRANSPORT_METHOD_LABELS[method]}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Conditions for each method */}
      {formData.transportMethods.map(method => (
        <div key={method} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-lg mb-4">
            Условия: {TRANSPORT_METHOD_LABELS[method]}
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Размер переноски
              </label>
              <input
                type="text"
                value={formData.conditions[method]?.maxCarrierSize || ''}
                onChange={e => handleConditionChange(method, 'maxCarrierSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="55x40x25 см"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Максимальный вес
              </label>
              <input
                type="text"
                value={formData.conditions[method]?.maxWeight || ''}
                onChange={e => handleConditionChange(method, 'maxWeight', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="8 кг"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Допустимые животные (через запятую)
              </label>
              <input
                type="text"
                value={formData.conditions[method]?.allowedAnimals?.join(', ') || ''}
                onChange={e =>
                  handleConditionChange(
                    method,
                    'allowedAnimals',
                    e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="собаки, кошки, птицы"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дополнительная информация
              </label>
              <textarea
                value={formData.conditions[method]?.additionalInfo || ''}
                onChange={e => handleConditionChange(method, 'additionalInfo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Дополнительные требования и ограничения"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Actions */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Сохранение...' : airline ? 'Обновить' : 'Создать'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Airline } from '../../types';
import { ApiService } from '../../services/ApiService';
import { AirlineForm } from '../../components/admin/AirlineForm';
import Header from '../../components/Header';

type ViewMode = 'list' | 'create' | 'edit';

export function AdminPanel() {
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedAirline, setSelectedAirline] = useState<Airline | null>(null);

  // Load airlines
  useEffect(() => {
    loadAirlines();
  }, []);

  const loadAirlines = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getAirlines();
      setAirlines(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (airline: Airline) => {
    await ApiService.createAirline(airline);
    await loadAirlines();
    setViewMode('list');
  };

  const handleUpdate = async (airline: Airline) => {
    if (!selectedAirline) return;
    await ApiService.updateAirline(selectedAirline.id, airline);
    await loadAirlines();
    setViewMode('list');
    setSelectedAirline(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту авиакомпанию?')) {
      return;
    }

    try {
      await ApiService.deleteAirline(id);
      await loadAirlines();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка удаления');
    }
  };

  const handleEdit = (airline: Airline) => {
    setSelectedAirline(airline);
    setViewMode('edit');
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedAirline(null);
  };

  if (viewMode === 'create') {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-100 py-8 px-4">
          <div className="max-w-4xl mx-auto mb-6">
            <button
              onClick={handleCancel}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
            >
              ← Назад к списку
            </button>
          </div>
          <AirlineForm onSubmit={handleCreate} onCancel={handleCancel} />
        </div>
      </>
    );
  }

  if (viewMode === 'edit' && selectedAirline) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-100 py-8 px-4">
          <div className="max-w-4xl mx-auto mb-6">
            <button
              onClick={handleCancel}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
            >
              ← Назад к списку
            </button>
          </div>
          <AirlineForm
            airline={selectedAirline}
            onSubmit={handleUpdate}
            onCancel={handleCancel}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🛠 Админ панель</h1>
              <p className="text-gray-600 mt-1">Управление авиакомпаниями</p>
            </div>
            <button
              onClick={() => setViewMode('create')}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Добавить авиакомпанию
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm mb-1">Всего авиакомпаний</div>
            <div className="text-3xl font-bold text-blue-600">{airlines.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm mb-1">С перевозкой в салоне</div>
            <div className="text-3xl font-bold text-green-600">
              {airlines.filter(a => a.transportMethods.includes('cabin')).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm mb-1">С карго перевозкой</div>
            <div className="text-3xl font-bold text-purple-600">
              {airlines.filter(a => a.transportMethods.includes('cargo')).length}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Загрузка...</p>
          </div>
        ) : (
          /* Airlines List */
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Авиакомпания
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Способы перевозки
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {airlines.map(airline => (
                  <tr key={airline.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{airline.logo}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {airline.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {airline.transportMethods.map(method => (
                          <span
                            key={method}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {method === 'cabin' && 'Салон'}
                            {method === 'baggage' && 'Багаж'}
                            {method === 'cargo' && 'Карго'}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {airline.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(airline)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Редактировать
                      </button>
                      <button
                        onClick={() => handleDelete(airline.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {airlines.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Авиакомпании не найдены
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </>
  );
}

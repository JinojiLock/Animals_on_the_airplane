import { useState, useEffect } from 'react';
import Header from './components/Header';
import Filters from './components/Filters';
import AirlineCard from './components/AirlineCard';
import Footer from './components/Footer';
import DonateButton from './components/DonateButton';
import { ApiService } from './services/ApiService';
import type { Airline } from './types';
import { useFilters } from './hooks/useFilters';

export function HomePage() {
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [filteredAirlines, setFilteredAirlines] = useState<Airline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { filters, toggleTransportMethod, setSearchQuery } = useFilters();

  // Load airlines from API
  useEffect(() => {
    const loadAirlines = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ApiService.getAirlines();
        setAirlines(data);
        setFilteredAirlines(data);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        setError('Не удалось загрузить данные. Попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    loadAirlines();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...airlines];

    // Filter by transport methods
    if (filters.transportMethods.length > 0) {
      filtered = filtered.filter(airline =>
        filters.transportMethods.some(method =>
          airline.transportMethods.includes(method)
        )
      );
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(airline =>
        airline.name.toLowerCase().includes(query)
      );
    }

    setFilteredAirlines(filtered);
  }, [filters, airlines]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <Filters
          selectedMethods={filters.transportMethods}
          searchQuery={filters.searchQuery}
          onMethodToggle={toggleTransportMethod}
          onSearchChange={setSearchQuery}
        />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : filteredAirlines.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              Авиакомпании не найдены
            </h3>
            <p className="text-gray-500">
              Попробуйте изменить параметры поиска или сбросить фильтры
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600">
              Найдено авиакомпаний: <span className="font-semibold">{filteredAirlines.length}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAirlines.map((airline) => (
                <AirlineCard key={airline.id} airline={airline} />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
      <DonateButton />
    </div>
  );
}

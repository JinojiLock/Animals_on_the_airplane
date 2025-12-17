import { useState, useCallback } from 'react';
import type { TransportMethod, Filters } from '../types';

export const useFilters = () => {
  const [filters, setFilters] = useState<Filters>({
    transportMethods: [],
    searchQuery: '',
  });

  const toggleTransportMethod = useCallback((method: TransportMethod) => {
    setFilters((prev) => {
      const newMethods = prev.transportMethods.includes(method)
        ? prev.transportMethods.filter((m) => m !== method)
        : [...prev.transportMethods, method];
      
      return {
        ...prev,
        transportMethods: newMethods,
      };
    });
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: query,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      transportMethods: [],
      searchQuery: '',
    });
  }, []);

  return {
    filters,
    toggleTransportMethod,
    setSearchQuery,
    resetFilters,
  };
};

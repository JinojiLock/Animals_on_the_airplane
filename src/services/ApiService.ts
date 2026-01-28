import { Airline } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export class ApiService {
  /**
   * Get all airlines with optional filters
   */
  static async getAirlines(params?: {
    transportMethods?: string[];
    search?: string;
  }): Promise<Airline[]> {
    const url = new URL(`${API_BASE_URL}/airlines`);
    
    if (params?.transportMethods) {
      params.transportMethods.forEach(method => {
        url.searchParams.append('transportMethods', method);
      });
    }
    
    if (params?.search) {
      url.searchParams.append('search', params.search);
    }

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Failed to fetch airlines: ${response.statusText}`);
    }
    
    return response.json();
  }

  /**
   * Get single airline by ID
   */
  static async getAirlineById(id: string): Promise<Airline> {
    const response = await fetch(`${API_BASE_URL}/airlines/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch airline: ${response.statusText}`);
    }
    
    return response.json();
  }

  /**
   * Create new airline
   */
  static async createAirline(airline: Airline): Promise<Airline> {
    const response = await fetch(`${API_BASE_URL}/airlines`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(airline),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create airline');
    }
    
    return response.json();
  }

  /**
   * Update existing airline
   */
  static async updateAirline(id: string, airline: Partial<Airline>): Promise<Airline> {
    const response = await fetch(`${API_BASE_URL}/airlines/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(airline),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update airline');
    }
    
    return response.json();
  }

  /**
   * Delete airline
   */
  static async deleteAirline(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/airlines/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete airline');
    }
  }

  /**
   * Get available transport methods
   */
  static async getTransportMethods(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/airlines/transport-methods`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch transport methods');
    }
    
    return response.json();
  }
}

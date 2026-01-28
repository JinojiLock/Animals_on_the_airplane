import { Request, Response } from 'express';
import pool from '../config/database.js';
import { Airline, TransportMethod, TransportConditions } from '../models/Airline.js';

export class AirlineController {
  /**
   * Get all airlines with optional filters
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { transportMethods, search } = req.query;
      
      let query = `
        SELECT DISTINCT
          a.id,
          a.name,
          a.logo,
          a.rules_url as "rulesUrl",
          ARRAY_AGG(DISTINCT tm.method) as transport_methods
        FROM airlines a
        LEFT JOIN transport_methods tm ON a.id = tm.airline_id
      `;

      const queryParams: any[] = [];
      const conditions: string[] = [];

      // Filter by transport methods
      if (transportMethods) {
        const methods = Array.isArray(transportMethods) 
          ? transportMethods 
          : [transportMethods];
        
        conditions.push(`tm.method = ANY($${queryParams.length + 1})`);
        queryParams.push(methods);
      }

      // Search by airline name
      if (search && typeof search === 'string') {
        conditions.push(`a.name ILIKE $${queryParams.length + 1}`);
        queryParams.push(`%${search}%`);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' GROUP BY a.id, a.name, a.logo, a.rules_url ORDER BY a.name';

      const result = await pool.query(query, queryParams);

      // Fetch conditions for each airline
      const airlines: Airline[] = await Promise.all(
        result.rows.map(async (row) => {
          const conditionsResult = await pool.query(
            `SELECT 
              transport_method,
              max_carrier_size as "maxCarrierSize",
              max_weight as "maxWeight",
              allowed_animals as "allowedAnimals",
              additional_info as "additionalInfo"
            FROM conditions
            WHERE airline_id = $1`,
            [row.id]
          );

          const conditions: any = {};
          conditionsResult.rows.forEach((cond) => {
            conditions[cond.transport_method] = {
              maxCarrierSize: cond.maxCarrierSize,
              maxWeight: cond.maxWeight,
              allowedAnimals: cond.allowedAnimals,
              additionalInfo: cond.additionalInfo,
            };
          });

          return {
            id: row.id,
            name: row.name,
            logo: row.logo,
            transportMethods: row.transport_methods || [],
            conditions,
            rulesUrl: row.rulesUrl,
          };
        })
      );

      res.json(airlines);
    } catch (error) {
      console.error('Error fetching airlines:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get single airline by ID
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const airlineResult = await pool.query(
        `SELECT 
          a.id,
          a.name,
          a.logo,
          a.rules_url as "rulesUrl",
          ARRAY_AGG(DISTINCT tm.method) as transport_methods
        FROM airlines a
        LEFT JOIN transport_methods tm ON a.id = tm.airline_id
        WHERE a.id = $1
        GROUP BY a.id, a.name, a.logo, a.rules_url`,
        [id]
      );

      if (airlineResult.rows.length === 0) {
        res.status(404).json({ error: 'Airline not found' });
        return;
      }

      const row = airlineResult.rows[0];

      const conditionsResult = await pool.query(
        `SELECT 
          transport_method,
          max_carrier_size as "maxCarrierSize",
          max_weight as "maxWeight",
          allowed_animals as "allowedAnimals",
          additional_info as "additionalInfo"
        FROM conditions
        WHERE airline_id = $1`,
        [id]
      );

      const conditions: any = {};
      conditionsResult.rows.forEach((cond) => {
        conditions[cond.transport_method] = {
          maxCarrierSize: cond.maxCarrierSize,
          maxWeight: cond.maxWeight,
          allowedAnimals: cond.allowedAnimals,
          additionalInfo: cond.additionalInfo,
        };
      });

      const airline: Airline = {
        id: row.id,
        name: row.name,
        logo: row.logo,
        transportMethods: row.transport_methods || [],
        conditions,
        rulesUrl: row.rulesUrl,
      };

      res.json(airline);
    } catch (error) {
      console.error('Error fetching airline:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get available transport methods
   */
  static async getTransportMethods(req: Request, res: Response): Promise<void> {
    try {
      const result = await pool.query(
        `SELECT DISTINCT method FROM transport_methods ORDER BY method`
      );
      
      res.json(result.rows.map(row => row.method));
    } catch (error) {
      console.error('Error fetching transport methods:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

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

  /**
   * Create new airline
   */
  static async create(req: Request, res: Response): Promise<void> {
    const client = await pool.connect();
    
    try {
      const { id, name, logo, transportMethods, conditions, rulesUrl } = req.body;

      // Validation
      if (!id || !name || !logo || !transportMethods || !Array.isArray(transportMethods)) {
        res.status(400).json({ error: 'Missing required fields: id, name, logo, transportMethods' });
        return;
      }

      await client.query('BEGIN');

      // Check if airline already exists
      const existingAirline = await client.query(
        'SELECT id FROM airlines WHERE id = $1',
        [id]
      );

      if (existingAirline.rows.length > 0) {
        res.status(409).json({ error: 'Airline with this ID already exists' });
        await client.query('ROLLBACK');
        return;
      }

      // Insert airline
      await client.query(
        `INSERT INTO airlines (id, name, logo, rules_url) 
         VALUES ($1, $2, $3, $4)`,
        [id, name, logo, rulesUrl || null]
      );

      // Insert transport methods
      for (const method of transportMethods) {
        await client.query(
          `INSERT INTO transport_methods (airline_id, method) 
           VALUES ($1, $2)`,
          [id, method]
        );
      }

      // Insert conditions
      if (conditions) {
        for (const [method, condition] of Object.entries(conditions)) {
          const cond = condition as TransportConditions;
          await client.query(
            `INSERT INTO conditions 
             (airline_id, transport_method, max_carrier_size, max_weight, allowed_animals, additional_info) 
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              id,
              method,
              cond.maxCarrierSize || null,
              cond.maxWeight || null,
              cond.allowedAnimals || null,
              cond.additionalInfo || null
            ]
          );
        }
      }

      await client.query('COMMIT');

      // Fetch and return created airline
      const newAirline = await AirlineController.fetchAirlineById(id);
      res.status(201).json(newAirline);
      
      console.log(`✅ Created airline: ${name} (${id})`);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating airline:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      client.release();
    }
  }

  /**
   * Update existing airline
   */
  static async update(req: Request, res: Response): Promise<void> {
    const client = await pool.connect();
    
    try {
      const { id } = req.params;
      const { name, logo, transportMethods, conditions, rulesUrl } = req.body;

      await client.query('BEGIN');

      // Check if airline exists
      const existingAirline = await client.query(
        'SELECT id FROM airlines WHERE id = $1',
        [id]
      );

      if (existingAirline.rows.length === 0) {
        res.status(404).json({ error: 'Airline not found' });
        await client.query('ROLLBACK');
        return;
      }

      // Update airline basic info
      await client.query(
        `UPDATE airlines 
         SET name = $1, logo = $2, rules_url = $3, updated_at = CURRENT_TIMESTAMP
         WHERE id = $4`,
        [name, logo, rulesUrl || null, id]
      );

      // Delete and re-insert transport methods
      if (transportMethods && Array.isArray(transportMethods)) {
        await client.query('DELETE FROM transport_methods WHERE airline_id = $1', [id]);
        
        for (const method of transportMethods) {
          await client.query(
            `INSERT INTO transport_methods (airline_id, method) 
             VALUES ($1, $2)`,
            [id, method]
          );
        }
      }

      // Delete and re-insert conditions
      if (conditions) {
        await client.query('DELETE FROM conditions WHERE airline_id = $1', [id]);
        
        for (const [method, condition] of Object.entries(conditions)) {
          const cond = condition as TransportConditions;
          await client.query(
            `INSERT INTO conditions 
             (airline_id, transport_method, max_carrier_size, max_weight, allowed_animals, additional_info) 
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              id,
              method,
              cond.maxCarrierSize || null,
              cond.maxWeight || null,
              cond.allowedAnimals || null,
              cond.additionalInfo || null
            ]
          );
        }
      }

      await client.query('COMMIT');

      // Fetch and return updated airline
      const updatedAirline = await AirlineController.fetchAirlineById(id);
      res.json(updatedAirline);
      
      console.log(`✅ Updated airline: ${name} (${id})`);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error updating airline:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      client.release();
    }
  }

  /**
   * Delete airline
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const result = await pool.query(
        'DELETE FROM airlines WHERE id = $1 RETURNING name',
        [id]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Airline not found' });
        return;
      }

      res.json({ message: 'Airline deleted successfully', id, name: result.rows[0].name });
      console.log(`✅ Deleted airline: ${result.rows[0].name} (${id})`);
    } catch (error) {
      console.error('Error deleting airline:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Helper: Fetch airline by ID (for internal use)
   */
  private static async fetchAirlineById(id: string): Promise<Airline> {
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

    return {
      id: row.id,
      name: row.name,
      logo: row.logo,
      transportMethods: row.transport_methods || [],
      conditions,
      rulesUrl: row.rulesUrl,
    };
  }
}

import pool from '../config/database.js';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface Conditions {
  maxCarrierSize?: string;
  maxWeight?: string;
  allowedAnimals?: string[];
  additionalInfo?: string;
}

interface AirlineData {
  id: string;
  name: string;
  logo: string;
  transportMethods: string[];
  conditions: {
    cabin?: Conditions;
    baggage?: Conditions;
    cargo?: Conditions;
  };
  rulesUrl?: string;
}

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');
  
  const client = await pool.connect();
  
  try {
    // Read airlines data from frontend JSON file
    const airlinesJsonPath = join(__dirname, '../../../src/data/airlines.json');
    const airlinesJson = await readFile(airlinesJsonPath, 'utf-8');
    const airlines: AirlineData[] = JSON.parse(airlinesJson);

    await client.query('BEGIN');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await client.query('DELETE FROM conditions');
    await client.query('DELETE FROM transport_methods');
    await client.query('DELETE FROM airlines');

    // Insert airlines
    console.log(`\n📝 Inserting ${airlines.length} airlines...`);
    
    for (const airline of airlines) {
      // Insert airline
      await client.query(
        `INSERT INTO airlines (id, name, logo, rules_url) 
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO NOTHING`,
        [airline.id, airline.name, airline.logo, airline.rulesUrl || null]
      );

      // Insert transport methods
      for (const method of airline.transportMethods) {
        await client.query(
          `INSERT INTO transport_methods (airline_id, method) 
           VALUES ($1, $2)
           ON CONFLICT (airline_id, method) DO NOTHING`,
          [airline.id, method]
        );
      }

      // Insert conditions
      for (const [method, condition] of Object.entries(airline.conditions)) {
        if (condition) {
          await client.query(
            `INSERT INTO conditions 
             (airline_id, transport_method, max_carrier_size, max_weight, allowed_animals, additional_info) 
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (airline_id, transport_method) DO NOTHING`,
            [
              airline.id,
              method,
              condition.maxCarrierSize || null,
              condition.maxWeight || null,
              condition.allowedAnimals || null,
              condition.additionalInfo || null
            ]
          );
        }
      }

      console.log(`  ✅ ${airline.name}`);
    }

    await client.query('COMMIT');
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`   Total airlines: ${airlines.length}`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase();

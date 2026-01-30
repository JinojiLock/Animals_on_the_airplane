import pool from '../config/database.js';

export async function up() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Create airlines table
    await client.query(`
      CREATE TABLE IF NOT EXISTS airlines (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        logo VARCHAR(10) NOT NULL,
        rules_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create transport_methods table
    await client.query(`
      CREATE TABLE IF NOT EXISTS transport_methods (
        id SERIAL PRIMARY KEY,
        airline_id VARCHAR(255) NOT NULL REFERENCES airlines(id) ON DELETE CASCADE,
        method VARCHAR(50) NOT NULL CHECK (method IN ('cabin', 'baggage', 'cargo')),
        UNIQUE(airline_id, method)
      );
    `);

    // Create conditions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS conditions (
        id SERIAL PRIMARY KEY,
        airline_id VARCHAR(255) NOT NULL REFERENCES airlines(id) ON DELETE CASCADE,
        transport_method VARCHAR(50) NOT NULL CHECK (transport_method IN ('cabin', 'baggage', 'cargo')),
        max_carrier_size VARCHAR(100),
        max_weight VARCHAR(50),
        allowed_animals TEXT[],
        additional_info TEXT,
        UNIQUE(airline_id, transport_method)
      );
    `);

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_airlines_name ON airlines(name);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_transport_methods_airline ON transport_methods(airline_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_conditions_airline ON conditions(airline_id);
    `);

    await client.query('COMMIT');
    console.log('✅ Migration completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function down() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    await client.query('DROP TABLE IF EXISTS conditions CASCADE;');
    await client.query('DROP TABLE IF EXISTS transport_methods CASCADE;');
    await client.query('DROP TABLE IF EXISTS airlines CASCADE;');
    
    await client.query('COMMIT');
    console.log('✅ Rollback completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Rollback failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

import pool from '../config/database.js';
import * as migration001 from './001_create_tables.js';

const migrations = [
  { name: '001_create_tables', up: migration001.up, down: migration001.down }
];

async function runMigrations() {
  console.log('🚀 Starting migrations...\n');
  
  try {
    for (const migration of migrations) {
      console.log(`Running migration: ${migration.name}`);
      await migration.up();
      console.log(`✅ Completed: ${migration.name}\n`);
    }
    
    console.log('🎉 All migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();

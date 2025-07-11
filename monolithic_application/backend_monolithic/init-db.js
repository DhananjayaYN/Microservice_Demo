const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

async function createDatabase() {
  // Create a connection without specifying the database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  });

  try {
    console.log('Creating database...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'Mololithic_db'}\``);
    console.log('✅ Database created or already exists');
    
    // Switch to the database
    await connection.changeUser({ database: process.env.DB_NAME || 'Mololithic_db' });
    
    // Read and execute the SQL file
    const sql = fs.readFileSync(path.join(__dirname, 'database_setup.sql'), 'utf8');
    const statements = sql.split(';').filter(statement => statement.trim() !== '');
    
    console.log('Executing database setup script...');
    for (const statement of statements) {
      try {
        await connection.query(statement);
      } catch (err) {
        if (err.code === 'ER_TABLE_EXISTS_ERROR') {
          console.log('ℹ️ Table already exists, skipping...');
        } else {
          throw err;
        }
      }
    }
    
    console.log('✅ Database setup completed successfully');
  } catch (err) {
    console.error('❌ Error setting up database:', err);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

// Run the setup
createDatabase().catch(console.error);

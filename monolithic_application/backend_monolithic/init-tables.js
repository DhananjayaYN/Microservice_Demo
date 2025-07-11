const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3308,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || 'Monolithic_db',
  multipleStatements: true,
};

async function createTables() {
  let connection;
  try {
    console.log('🔍 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'database_setup.sql');
    console.log(`📄 Reading SQL file: ${sqlFilePath}`);
    const sql = await fs.readFile(sqlFilePath, 'utf-8');

    // Split into individual statements and execute them
    const statements = sql
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    console.log(`🔨 Found ${statements.length} SQL statements to execute`);
    
    for (const [index, statement] of statements.entries()) {
      try {
        console.log(`\n🔄 Executing statement ${index + 1}/${statements.length}...`);
        await connection.query(statement);
        console.log(`✅ Statement ${index + 1} executed successfully`);
      } catch (error) {
        if (error.code === 'ER_TABLE_EXISTS_ERROR') {
          console.log('ℹ️  Table already exists, skipping...');
        } else {
          throw error;
        }
      }
    }

    console.log('\n✨ Database tables created successfully!');
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    console.error('Error details:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      sql: error.sql ? error.sql.substring(0, 200) + '...' : 'N/A'
    });
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the initialization
createTables().catch(console.error);

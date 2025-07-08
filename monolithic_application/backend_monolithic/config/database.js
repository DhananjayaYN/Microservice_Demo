const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

// Database configuration for Docker MySQL
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3308, // Docker exposes MySQL on 3308
  user: process.env.DB_USER || 'microservice_user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'user_management_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // 10 seconds
  multipleStatements: true,
  debug: false
};

// Log the database config (safe version without password)
// console.log('Database Configuration:', {
//   host: dbConfig.host,
//   port: dbConfig.port,
//   user: dbConfig.user,
//   database: dbConfig.database,
//   usingPassword: !!dbConfig.password
// });

// Create a connection pool
let pool;

try {
  pool = mysql.createPool(dbConfig);
  console.log('✅ Database pool created successfully');
} catch (error) {
  console.error('❌ Failed to create database pool:', error.message);
  process.exit(1);
}

// Test the database connection
async function testConnection() {
  let connection;
  try {
    console.log('Attempting to connect to the database...');
    console.log('Database Config:', {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database,
      usingPassword: !!dbConfig.password
    });
    
    connection = await pool.getConnection();
    console.log('✅ Successfully connected to the database');
    
    // Test query to verify database access
    const [rows] = await connection.query('SELECT DATABASE() as db, USER() as user');
    console.log('Database connection verified:', rows[0]);
    
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.error('Error details:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    
    // Provide helpful troubleshooting tips
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n🔑 Authentication failed. Please check:');
      console.error('1. MySQL server is running');
      console.error('2. Username and password in .env are correct');
      console.error('3. User has proper permissions');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n🔌 Connection refused. Please check:');
      console.error('1. MySQL server is running');
      console.error(`2. Can connect to MySQL at ${dbConfig.host}:${dbConfig.port}`);
      console.error('3. Firewall allows connections to MySQL port');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error(`\n📛 Database '${dbConfig.database}' doesn't exist.`);
      console.error('Please create the database first.');
    }
    
    return false;
  } finally {
    if (connection) await connection.release();
  }
}

// Export the pool and test function
module.exports = {
  pool,
  testConnection,
  // Export a getter for the raw config (for debugging)
  getConfig: () => ({ ...dbConfig, password: dbConfig.password ? '***' : '' })
};

module.exports = {
  pool,
  testConnection
};

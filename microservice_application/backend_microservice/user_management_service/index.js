const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const userRoutes = require('./src/routes/userRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// MySQL connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'user_management_db'
};

// Function to create tables if they don't exist
async function createTables(connection) {
  try {
    // Create users table if it doesn't exist
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await connection.execute(createUsersTable);
    console.log('Users table created or already exists. Table structure includes columns: id, username, email, password, phone, address, created_at, updated_at');
    
    // Migrate existing table to add new columns if they don't exist
    try {
      await connection.execute('ALTER TABLE users ADD COLUMN phone VARCHAR(20) AFTER password');
      console.log('Added phone column to users table');
    } catch (alterErr) {
      if (alterErr.code !== 'ER_DUP_FIELDNAME') {
        console.error('Error adding phone column:', alterErr.message);
      } else {
        console.log('Phone column already exists in users table');
      }
    }
    
    try {
      await connection.execute('ALTER TABLE users ADD COLUMN address TEXT AFTER phone');
      console.log('Added address column to users table');
    } catch (alterErr) {
      if (alterErr.code !== 'ER_DUP_FIELDNAME') {
        console.error('Error adding address column:', alterErr.message);
      } else {
        console.log('Address column already exists in users table');
      }
    }
  } catch (err) {
    console.error('Error creating tables:', err);
    throw err;
  }
}

// Function to connect to MySQL database
async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Database connected successfully');
    await createTables(connection);
    return connection;
  } catch (err) {
    console.error('MySQL connection error:', err);
    throw err;
  }
}

// Function to register service with the Service Registry with retry mechanism
async function registerService() {
  try {
    const axios = require('axios');
    const SERVICE_REGISTRY_URL = process.env.SERVICE_REGISTRY_URL || 'http://localhost:3005';
    const serviceData = {
      serviceName: 'user-management-service',
      host: 'localhost',
      port: PORT
    };
    console.log(`Attempting to register service with Service Registry at: ${SERVICE_REGISTRY_URL}/register`);
    let attempts = 0;
    const maxAttempts = 5;
    const retryInterval = 5000; // 5 seconds
    while (attempts < maxAttempts) {
      try {
        await axios.post(`${SERVICE_REGISTRY_URL}/register`, serviceData);
        console.log('Service successfully registered with Service Registry as user-management');
        return;
      } catch (error) {
        attempts++;
        console.error(`Attempt ${attempts}/${maxAttempts} - Error registering service with Service Registry:`, error.message);
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, retryInterval));
        }
      }
    }
    console.error('Failed to register service after maximum attempts. Please ensure Service Registry is running on the correct port.');
  } catch (error) {
    console.error('Unexpected error in service registration:', error.message);
  }
}

// Error handling middleware for uncaught errors
app.use((err, req, res, next) => {
  console.error('Unhandled error in User Management Service:', err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong in the User Management Service. Please try again later.'
  });
});

// Start server only after successful database connection
connectToDatabase()
  .then(() => {
app.listen(PORT, '0.0.0.0', () => {
  console.log(`User Management Service running on port ${PORT}, listening on all interfaces`);
  registerService();
});
  })
  .catch((err) => {
    console.error('Failed to start server due to database connection failure:', err);
    process.exit(1);
  });

module.exports = app;

const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const orderRoutes = require('./src/routes/orderRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json());

// Routes
app.use('/api/orders', orderRoutes);

// MySQL connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'order_management_db'
};

// Function to create tables if they don't exist
async function createTables(connection) {
  try {
    // Create orders table if it doesn't exist
    const createOrdersTable = `
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await connection.execute(createOrdersTable);
    console.log('Orders table created or already exists');
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

// Start server only after successful database connection
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Order Management Service running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server due to database connection failure:', err);
    process.exit(1);
  });

module.exports = app;

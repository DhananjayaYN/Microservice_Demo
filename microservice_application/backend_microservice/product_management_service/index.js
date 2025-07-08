const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const axios = require('axios');
const productRoutes = require('./src/routes/productRoutes');
const dbConfig = require('./config/database');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'product-management' });
});

// Routes
app.use('/api/products', productRoutes);

// Function to create tables if they don't exist
async function createTables(connection) {
  try {
    // Create products table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        stock INT NOT NULL,
        category VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Products table created or already exists');
    
    // Insert sample data if table is empty
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM products');
    if (rows[0].count === 0) {
      const sampleProducts = [
        { name: 'Laptop', description: 'High performance laptop', price: 999.99, stock: 10, category: 'Electronics' },
        { name: 'Smartphone', description: 'Latest model smartphone', price: 699.99, stock: 15, category: 'Electronics' },
        { name: 'Headphones', description: 'Noise cancelling headphones', price: 199.99, stock: 20, category: 'Accessories' },
        { name: 'Keyboard', description: 'Mechanical gaming keyboard', price: 129.99, stock: 12, category: 'Accessories' },
        { name: 'Mouse', description: 'Wireless gaming mouse', price: 79.99, stock: 18, category: 'Accessories' }
      ];
      
      for (const product of sampleProducts) {
        await connection.execute(
          'INSERT INTO products (name, description, price, stock, category) VALUES (?, ?, ?, ?, ?)',
          [product.name, product.description, product.price, product.stock, product.category]
        );
      }
      
      console.log('Inserted sample products');
    }
  } catch (error) {
    console.error('Error creating tables or inserting sample data:', error);
    throw error;
  }
}

// Function to connect to MySQL database
async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');
    await createTables(connection);
    return connection;
  } catch (error) {
    console.error('Error connecting to MySQL database:', error);
    process.exit(1);
  }
}

// Register service with service registry with retry logic
async function registerService() {
  const serviceRegistryUrl = process.env.SERVICE_REGISTRY_URL || 'http://localhost:3005';
  const serviceUrl = `http://localhost:${PORT}`;
  
  const serviceData = {
    serviceName: 'product-management-service',
    host: 'localhost',
    port: PORT.toString(),
    healthEndpoint: `${serviceUrl}/health`,
    metadata: {
      version: '1.0.0',
      description: 'Product Management Service',
      endpoints: ['/api/products']
    }
  };

  const maxRetries = 3;
  let retryCount = 0;

  const tryRegister = async () => {
    try {
      const response = await axios.post(`${serviceRegistryUrl}/register`, serviceData);
      console.log('Successfully registered with service registry');
      return true;
    } catch (error) {
      retryCount++;
      if (retryCount < maxRetries) {
        console.log(`Registration attempt ${retryCount} failed, retrying in 3 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        return tryRegister();
      } else {
        console.error('Failed to register with service registry after multiple attempts:', error.message);
        return false;
      }
    }
  };

  return tryRegister();
}

// Start server only after successful database connection
connectToDatabase()
  .then(() => {
    const server = app.listen(PORT, async () => {
      console.log(`Product Management Service running on port ${PORT}`);
      
      // Register with service registry after server starts
      try {
        await registerService();
      } catch (error) {
        console.error('Error during service registration:', error);
      }
    });

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('Shutting down Product Management Service...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  })
  .catch((err) => {
    console.error('Failed to start server due to database connection failure:', err);
    process.exit(1);
  });

module.exports = app;

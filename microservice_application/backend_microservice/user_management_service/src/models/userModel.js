const mysql = require('mysql2/promise');

// Since we're using MySQL, we'll define the schema as a reference
// The actual table creation is handled in index.js


const UserSchema = {
  tableName: 'users',
  columns: {
    id: 'id',
    username: 'username',
    email: 'email',
    password: 'password',
    phone: 'phone',
    address: 'address',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
};



// Function to get a database connection
async function getConnection() {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'user_management_db'
  };
  return await mysql.createConnection(dbConfig);
}

module.exports = {
  UserSchema,
  getConnection
};





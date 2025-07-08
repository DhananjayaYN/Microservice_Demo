const mysql = require('mysql2/promise');
const dbConfig = require('../../config/database');

// Create a connection pool
const pool = mysql.createPool(dbConfig);

const getAllProducts = async () => {
  const connection = await pool.getConnection();
  try {
    return await Product.getAll(connection);
  } finally {
    connection.release();
  }
};

const getProductById = async (id) => {
  const connection = await pool.getConnection();
  try {
    return await Product.getById(connection, id);
  } finally {
    connection.release();
  }
};

const createProduct = async (productData) => {
  const connection = await pool.getConnection();
  try {
    return await Product.create(connection, productData);
  } finally {
    connection.release();
  }
};

const updateProduct = async (id, productData) => {
  const connection = await pool.getConnection();
  try {
    return await Product.update(connection, id, productData);
  } finally {
    connection.release();
  }
};

const deleteProduct = async (id) => {
  const connection = await pool.getConnection();
  try {
    return await Product.delete(connection, id);
  } finally {
    connection.release();
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

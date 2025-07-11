const mysql = require('mysql2/promise');
const dbConfig = require('../../config/database');

// Create a connection pool
const pool = mysql.createPool(dbConfig);

class Product {
  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM products');
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(productData) {
    const { name, description, price, stock, category } = productData;
    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, stock, category) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, stock, category]
    );
    return { id: result.insertId, ...productData };
  }

  static async update(id, productData) {
    const { name, description, price, stock, category } = productData;
    await pool.query(
      'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category = ? WHERE id = ?',
      [name, description, price, stock, category, id]
    );
    return { id, ...productData };
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Product;

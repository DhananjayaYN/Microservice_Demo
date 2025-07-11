const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create({ username, email, password, phone, address }) {
    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, phone, address) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, phone, address]
    );
    
    // Return the user without the password
    const user = await this.findById(result.insertId);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, { username, phone, address }) {
    const [result] = await pool.query(
      'UPDATE users SET username = ?, phone = ?, address = ? WHERE id = ?',
      [username, phone, address, id]
    );
    return result.affectedRows > 0;
  }

  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
  }
}

module.exports = User;



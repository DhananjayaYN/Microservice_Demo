const bcrypt = require('bcryptjs');
const { getConnection, UserSchema } = require('../models/userModel');

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    console.log('Incoming registration data:', req.body);
    const { name, email, password, phone, address } = req.body;

    // Get database connection
    const connection = await getConnection();

    // Check if user already exists
    const [existingUser] = await connection.query(
      `SELECT * FROM ${UserSchema.tableName} WHERE email = ?`,
      [email]
    );
    if (existingUser.length > 0) {
      await connection.end();
      return res.status(400).json({
        status: 'fail',
        message: 'Email already registered. Please use a different email.'
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Insert new user
    const [result] = await connection.query(
      `INSERT INTO ${UserSchema.tableName} (username, email, password, phone, address) VALUES (?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, phone || null, address || null]
    );

    await connection.end();

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: result.insertId,
          name,
          email,
          phone: phone || null,
          address: address || null
        }
      }
    });
  } catch (err) {
    console.error('Error in registerUser:', err);
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Login user (authenticate)
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get database connection
    const connection = await getConnection();

    // Find user by email
    const [userRows] = await connection.query(
      `SELECT * FROM ${UserSchema.tableName} WHERE email = ?`,
      [email]
    );

    if (userRows.length === 0) {
      await connection.end();
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }

    const user = userRows[0];

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      await connection.end();
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }

    await connection.end();

    // If authentication successful, return user data (excluding password)
    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          name: user.username,
          email: user.email,
          phone: user.phone || null,
          address: user.address || null
        }
      }
    });
  } catch (err) {
    console.error('Error in loginUser:', err);
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const connection = await getConnection();
    const [users] = await connection.query(`SELECT * FROM ${UserSchema.tableName}`);
    await connection.end();

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  } catch (err) {
    console.error('Error in getAllUsers:', err);
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Get single user by ID
exports.getUser = async (req, res) => {
  try {
    const connection = await getConnection();
    const [userRows] = await connection.query(
      `SELECT * FROM ${UserSchema.tableName} WHERE id = ?`,
      [req.params.id]
    );
    await connection.end();

    if (userRows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No user found with that ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: userRows[0]
      }
    });
  } catch (err) {
    console.error('Error in getUser:', err);
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    if (req.body.password) {
      return res.status(400).json({
        status: 'fail',
        message: 'This route is not for password updates. Please use /updateMyPassword.'
      });
    }

    const connection = await getConnection();
    const updateFields = {};
    const fieldValues = [];
    const allowedFields = ['username', 'email', 'phone', 'address'];

    allowedFields.forEach(field => {
      if (req.body[field]) {
        updateFields[field] = req.body[field];
        fieldValues.push(req.body[field]);
      }
    });

    if (Object.keys(updateFields).length === 0) {
      await connection.end();
      return res.status(400).json({
        status: 'fail',
        message: 'No valid fields provided for update.'
      });
    }

    fieldValues.push(req.params.id); // for the WHERE clause
    const setStatements = Object.keys(updateFields).map(field => `${field} = ?`).join(', ');
    const query = `UPDATE ${UserSchema.tableName} SET ${setStatements} WHERE id = ?`;

    const [result] = await connection.query(query, fieldValues);

    if (result.affectedRows === 0) {
      await connection.end();
      return res.status(404).json({
        status: 'fail',
        message: 'No user found with that ID'
      });
    }

    const [updatedUser] = await connection.query(
      `SELECT * FROM ${UserSchema.tableName} WHERE id = ?`,
      [req.params.id]
    );

    await connection.end();

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser[0]
      }
    });
  } catch (err) {
    console.error('Error in updateUser:', err);
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const connection = await getConnection();
    const [result] = await connection.query(
      `DELETE FROM ${UserSchema.tableName} WHERE id = ?`,
      [req.params.id]
    );
    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No user found with that ID'
      });
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    console.error('Error in deleteUser:', err);
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

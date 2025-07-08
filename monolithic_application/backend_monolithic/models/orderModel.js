const { pool } = require('../config/database');

class Order {
  static async create({ userId, items, totalAmount, shippingAddress, paymentMethod }) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Create order
      const [orderResult] = await connection.query(
        'INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_method) VALUES (?, ?, ?, ?, ?)',
        [userId, totalAmount, 'pending', shippingAddress, paymentMethod]
      );
      
      const orderId = orderResult.insertId;
      
      // Create order items
      for (const item of items) {
        await connection.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.productId, item.quantity, item.price]
        );
        
        // Update product stock
        await connection.query(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.productId]
        );
      }
      
      await connection.commit();
      return this.findById(orderId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findById(id) {
    const [orderRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (!orderRows.length) return null;
    
    const [itemRows] = await pool.query(
      'SELECT oi.*, p.name, p.image_url FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
      [id]
    );
    
    return {
      ...orderRows[0],
      items: itemRows
    };
  }

  static async findByUserId(userId) {
    const [orders] = await pool.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const [items] = await pool.query(
          'SELECT oi.*, p.name, p.image_url FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
          [order.id]
        );
        return { ...order, items };
      })
    );
    
    return ordersWithItems;
  }

  static async updateStatus(id, status) {
    const [result] = await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows > 0 ? this.findById(id) : null;
  }
}

module.exports = Order;

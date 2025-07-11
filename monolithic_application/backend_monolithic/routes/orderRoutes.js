const express = require('express');
const Order = require('../models/orderModel');

const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }
    
    // Calculate total amount
    const totalAmount = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    
    const order = await Order.create({
      userId,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod
    });
    
    res.status(201).json({
      status: 'success',
      data: { order }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error creating order' });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (order) {
      // Make sure the order belongs to the user or the user is an admin
      if (order.user_id.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized' });
      }
      
      res.json({
        status: 'success',
        data: { order }
      });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error fetching order' });
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/user/:userId
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.findByUserId(req.params.userId);
    res.json({
      status: 'success',
      results: orders.length,
      data: { orders }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error fetching user orders' });
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Public
router.put('/:id/pay', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (order) {
      // Make sure the order belongs to the user or the user is an admin
      if (order.user_id.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized' });
      }
      
      // Update order status to processing (in a real app, you'd process payment here)
      const updatedOrder = await Order.updateStatus(order.id, 'processing');
      
      res.json({
        status: 'success',
        data: { order: updatedOrder }
      });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Update order to paid error:', error);
    res.status(500).json({ message: 'Server error updating order' });
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public
router.get('/', async (req, res) => {
  try {
    // In a real app, you'd implement pagination here
    const [orders] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    
    res.json({
      status: 'success',
      results: orders.length,
      data: { orders }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error fetching all orders' });
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Public
router.put('/:id/deliver', async (req, res) => {
  try {
    const order = await Order.updateStatus(req.params.id, 'delivered');
    
    if (order) {
      res.json({
        status: 'success',
        data: { order }
      });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Update order to delivered error:', error);
    res.status(500).json({ message: 'Server error updating order' });
  }
});

module.exports = router;

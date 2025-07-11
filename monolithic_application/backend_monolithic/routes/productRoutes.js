const express = require('express');
const Product = require('../models/productModel');

const router = express.Router();

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json({
      status: 'success',
      results: products.length,
      data: { products }
    });
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (product) {
      res.json({
        status: 'success',
        data: { product }
      });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Fetch product error:', error);
    res.status(500).json({ message: 'Server error fetching product' });
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, description, price, stock, category, image_url } = req.body;
    
    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      image_url
    });
    
    res.status(201).json({
      status: 'success',
      data: { product }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error creating product' });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, stock, category, image_url } = req.body;
    
    const product = await Product.update(req.params.id, {
      name,
      description,
      price,
      stock,
      category,
      image_url
    });
    
    if (product) {
      res.json({
        status: 'success',
        data: { product }
      });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error updating product' });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.delete(req.params.id);
    
    if (deleted) {
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
});

module.exports = router;

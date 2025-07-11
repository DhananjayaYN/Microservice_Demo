const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A product must have a name'],
    trim: true,
    maxlength: [40, 'A product name must have less or equal than 40 characters'],
    minlength: [2, 'A product name must have more or equal than 2 characters'],
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'A product must have a price'],
    min: [0, 'Price must be above 0'],
  },
  stock: {
    type: Number,
    required: [true, 'A product must have stock information'],
    min: [0, 'Stock must be above 0'],
  },
  category: {
    type: String,
    required: [true, 'A product must have a category'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

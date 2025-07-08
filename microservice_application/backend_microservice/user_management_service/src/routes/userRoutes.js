const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Authentication routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// User management routes
router.route('/')
  .get(userController.getAllUsers);

router.route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;

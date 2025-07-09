# Monolithic E-commerce Application

A full-stack e-commerce application built with a monolithic architecture, featuring user management, product catalog, and order processing in a single codebase.

## 🚀 Features

- **User Management**
  - User registration and authentication
  - Profile management
  - Secure password handling with bcrypt
  - JWT-based authentication

- **Product Catalog**
  - Browse and search products
  - Product categories and filters
  - Product details and reviews
  - Admin product management

- **Order Processing**
  - Shopping cart functionality
  - Checkout process
  - Order history and tracking
  - Admin order management

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- React Bootstrap for UI components
- Context API for state management

### Backend
- Node.js with Express
- MySQL Database
- JWT Authentication
- Sequelize ORM
- RESTful API

## 📦 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn
- Git

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ecommerce-monolithic.git
cd ecommerce-monolithic
```

### 2. Set Up Environment Variables
Create a `.env` file in the backend directory:
```
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=ecommerce_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3001
```

### 3. Install Dependencies
```bash
# Install backend dependencies
cd backend_monolithic
npm install

# Install frontend dependencies
cd ../frontend_monolithic
npm install
```

### 4. Database Setup
1. Create a MySQL database named `ecommerce_db`
2. Run database migrations:
   ```bash
   cd backend_monolithic
   npx sequelize-cli db:migrate
   ```
3. (Optional) Seed initial data:
   ```bash
   npx sequelize-cli db:seed:all
   ```

### 5. Start the Application

#### Start Backend Server
```bash
cd backend_monolithic
npm start
```

#### Start Frontend Development Server
```bash
cd frontend_monolithic
npm start
```

The application will be available at:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `GET /api/orders` - Get all orders (admin) or user's orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status (admin only)

## 🔒 Environment Variables

### Backend (.env)
```
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=ecommerce_db

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3001
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3000/api
```

## 🧪 Testing

Run backend tests:
```bash
cd backend_monolithic
npm test
```

Run frontend tests:
```bash
cd frontend_monolithic
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

Your Name - [@your_twitter](https://twitter.com/your_username) - your.email@example.com

Project Link: [https://github.com/yourusername/ecommerce-monolithic](https://github.com/yourusername/ecommerce-monolithic)

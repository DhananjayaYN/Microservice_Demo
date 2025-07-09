# Microservices E-commerce Application

A full-stack e-commerce application built with a microservices architecture, featuring user management, product catalog, and order processing services.

## 🚀 Features

- **User Management**
  - User registration and authentication
  - Profile management
  - Secure password handling

- **Product Catalog**
  - Browse products
  - Product categories and search
  - Product details and reviews

- **Order Processing**
  - Shopping cart functionality
  - Order placement and tracking
  - Order history

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- React Bootstrap for UI components

### Backend (Microservices)
- Node.js with Express
- MySQL Database
- JWT Authentication
- API Gateway
- Service Discovery

## 📦 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn
- Git

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/microservice-application.git
cd microservice-application
```

### 2. Set Up Environment Variables
Create a `.env` file in each service directory with the required environment variables.

Example for user service (backend_microservice/user_management_service/.env):
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=user_management_db
JWT_SECRET=your_jwt_secret
PORT=3001
```

### 3. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend microservices dependencies
cd ../backend_microservice/user_management_service
npm install
```

### 4. Database Setup
1. Create a MySQL database
2. Run the database migrations

### 5. Start the Application

#### Start API Gateway
```bash
cd backend_microservice/api_gateway
npm start
```

#### Start User Service
```bash
cd ../user_management_service
npm start
```

#### Start Frontend
```bash
cd ../../frontend
npm start
```

## 🌐 API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

## 🔒 Environment Variables

### Frontend
```
REACT_APP_API_URL=http://localhost:4000
```

### Backend
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
JWT_SECRET=your_jwt_secret
PORT=3001
```

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

Your Name - [@your_twitter](https://twitter.com/your_username) - your.email@example.com

Project Link: [https://github.com/yourusername/microservice-application](https://github.com/yourusername/microservice-application)

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MySQL](https://www.mysql.com/)
- [JWT](https://jwt.io/)

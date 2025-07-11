# Microservices and Monolithic Application Demo

This project demonstrates both monolithic and microservices architectures for an e-commerce application. It includes both frontend and backend components.

## Project Structure

```
Microservices/
├── microservice_application/           # Microservices Architecture
│   ├── frontend/                     # React frontend
│   └── backend_microservice/          # Backend microservices
│       ├── user_management_service/   # User management microservice
│       ├── order_management_service/  # Order management microservice
│       └── product_management_service/ # Product management microservice
└── monolithic_application/           # Monolithic Architecture
    ├── frontend_monolithic/          # React frontend
    └── backend_monolithic/           # Express backend
```

## Features

### Monolithic Architecture
- User authentication and authorization
- Product management
- Order processing
- Health check endpoints
- CORS support
- Environment configuration

### Microservices Architecture
- Separate services for:
  - User management
  - Product management
  - Order processing
- Service-based architecture
- Independent deployment capabilities

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MySQL Database
- Git

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd Microservices
```

2. Install dependencies for both architectures:
```bash
# For monolithic application
cd monolithic_application/backend_monolithic
npm install

# For microservices
cd ../.. && cd microservice_application/backend_microservice/user_management_service
npm install
```

3. Set up environment variables:
Create `.env` files in both backend directories with the following variables:
```env
PORT=3020
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=user_management_db
```

### Running the Application

#### Monolithic Application
```bash
cd monolithic_application/backend_monolithic
npm start
```

#### Microservices Application
```bash
cd microservice_application/backend_microservice/user_management_service
npm start
```

### API Documentation

#### Monolithic API Endpoints
- Users: `/api/users`
- Products: `/api/products`
- Orders: `/api/orders`
- Health Check: `/health`

#### Microservices API Endpoints
- User Service: `/api/users`
- Product Service: `/api/products`
- Order Service: `/api/orders`

## Database Setup

The application uses MySQL database. You can initialize the database using the provided scripts:

```bash
# For monolithic application
cd monolithic_application/backend_monolithic
npm run init-db

# For microservices
cd ../.. && cd microservice_application/backend_microservice/user_management_service
npm run init-db
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React for frontend development
- Express.js for backend
- MySQL for database
- Various open-source packages and libraries

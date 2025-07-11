const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const SERVICE_REGISTRY_URL = process.env.SERVICE_REGISTRY_URL || 'http://localhost:3005';

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());

// Function to get service instance from registry
async function getServiceInstance(serviceName) {
  // Map the incoming service name to the registered service name if needed
  const mappedServiceName = serviceName === 'user-management' ? 'user-management-service' : serviceName;
  try {
    const response = await axios.get(`${SERVICE_REGISTRY_URL}/services?serviceName=${mappedServiceName}`);
    const services = response.data;
    if (services.length === 0) {
      throw new Error(`No instances found for service: ${mappedServiceName}`);
    }
    // Simple round-robin or random selection can be implemented here
    return services[0];
  } catch (error) {
    console.error(`Error fetching service instance for ${mappedServiceName}:`, error.message);
    console.error(`Service Registry URL used: ${SERVICE_REGISTRY_URL}/services?serviceName=${mappedServiceName}`);
    throw error;
  }
}

// User Management Service Routes
const userManagementRoutes = [
  '/api/users/register',
  '/api/users/login',
  '/api/users/profile',
  '/api/users/:id'
];

// Product Management Service Routes
const productManagementRoutes = [
  '/api/products',
  '/api/products/*'
];

// Handle user management routes
app.use(userManagementRoutes, async (req, res) => {
  // Map to the correct service name in the registry
  await forwardRequest(req, res, 'user-management-service');
});

// Handle product management routes
app.use(productManagementRoutes, async (req, res) => {
  // Map to the correct service name in the registry
  await forwardRequest(req, res, 'product-management-service');
});

// Function to forward requests to the appropriate service
async function forwardRequest(req, res, serviceName) {
  try {
    let serviceUrl;
    let originalPath = req.originalUrl;
    
    // Directly route to known services without service registry
    if (serviceName === 'product-management-service') {
      serviceUrl = `http://localhost:3002`; // Directly point to product service
    } else if (serviceName === 'user-management-service') {
      serviceUrl = `http://localhost:3003`; // Directly point to user service
    } else {
      // Use service registry for other services
      const service = await getServiceInstance(serviceName);
      serviceUrl = `http://${service.host}:${service.port}`;
    }
    
    // Remove the /api prefix for the target service
    const targetPath = originalPath.startsWith('/api') ? originalPath : `/api${originalPath}`;
    
    console.log(`[API Gateway] Forwarding ${req.method} request to: ${serviceUrl}${targetPath}`);
    
    const response = await axios({
      method: req.method,
      url: `${serviceUrl}${targetPath}`,
      data: req.body,
      params: req.query,
      headers: {
        ...req.headers,
        host: undefined, // Remove the host header
        'content-type': 'application/json'
      },
      validateStatus: () => true // Forward all status codes
    });
    
    console.log('Successfully responded!');
    res.status(response.status).json(response.data);
    
  } catch (error) {
    console.error(`[API Gateway] Error in ${serviceName} request:`, error.message);
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Internal Server Error';
    
    res.status(status).json({ 
      status: 'error',
      message,
      timestamp: new Date().toISOString()
    });
  }
}

// Generic route for all other services
app.all('/:serviceName/:path(*)', async (req, res) => {
  const { serviceName, path } = req.params;
  const fullPath = path || '';
  try {
    const service = await getServiceInstance(serviceName);
    // console.log('Full path being used:', fullPath);
    const url = `http://${service.host}:${service.port}/${fullPath}`;
    console.log(`Forwarding request to ${url} with method ${req.method} and body:`, req.body);
    
    // Filter out headers that might cause issues with the target service
    const filteredHeaders = { ...req.headers };
    delete filteredHeaders['host'];
    delete filteredHeaders['connection'];
    delete filteredHeaders['postman-token'];
    // Explicitly ensure Content-Type is set to application/json
    filteredHeaders['Content-Type'] = 'application/json';
    
    // console.log('Request configuration:', {
    //   method: req.method,
    //   url: url,
    //   data: req.body,
    //   headers: filteredHeaders
    // });
    console.log('Sending request to service with no timeout (waiting indefinitely)...');
    const response = await axios({
      method: req.method,
      url: url,
      data: req.body,
      headers: filteredHeaders
      // Timeout removed to allow indefinite waiting for response
    });
    console.log('Response received with status:', response.status);
    // console.log('Response data:', response.data);
    
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`Error forwarding request to ${serviceName}:`, error.message);
    if (error.code === 'ECONNABORTED') {
      res.status(504).json({ error: `Timeout error: Service ${serviceName} did not respond. Please check if the service is running and responding to requests. Ensure the service is not experiencing delays or blocking requests from the API Gateway.` });
    } else if (error.code === 'ECONNREFUSED') {
      res.status(503).json({ error: `Connection refused: Service ${serviceName} may not be running. Please start the service and try again.` });
    } else if (error.message && error.message.includes('No instances found for service')) {
      const mappedServiceName = serviceName === 'user-management' ? 'user-management-service' : serviceName;
      res.status(503).json({ error: `Service ${mappedServiceName} not registered with Service Registry. Ensure Service Registry is running on port 3005 and restart the ${mappedServiceName} service to register it. Error: ${error.message}` });
    } else {
      res.status(503).json({ error: `Service ${serviceName} unavailable or not found. Ensure Service Registry and the service are running. Error: ${error.message}` });
    }
  }
});

// Start the API Gateway server
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});

module.exports = app;

const express = require('express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(express.json());

// In-memory storage for registered services
const services = {};

// Register a service
app.post('/register', (req, res) => {
  const { serviceName, host, port } = req.body;
  if (!serviceName || !host || !port) {
    return res.status(400).json({ error: 'Missing required parameters: serviceName, host, port' });
  }
  
  const key = `${serviceName}-${host}:${port}`;
  services[key] = { serviceName, host, port, timestamp: Date.now() };
  console.log(`Service registered: ${serviceName} at ${host}:${port}`);
  res.status(200).json({ message: 'Service registered successfully' });
});

// Unregister a service
app.post('/unregister', (req, res) => {
  const { serviceName, host, port } = req.body;
  if (!serviceName || !host || !port) {
    return res.status(400).json({ error: 'Missing required parameters: serviceName, host, port' });
  }
  
  const key = `${serviceName}-${host}:${port}`;
  if (services[key]) {
    delete services[key];
    console.log(`Service unregistered: ${serviceName} at ${host}:${port}`);
    res.status(200).json({ message: 'Service unregistered successfully' });
  } else {
    res.status(404).json({ error: 'Service not found' });
  }
});

// Get all services or filter by service name
app.get('/services', (req, res) => {
  const { serviceName } = req.query;
  if (serviceName) {
    const filteredServices = Object.values(services).filter(s => s.serviceName === serviceName);
    res.status(200).json(filteredServices);
  } else {
    res.status(200).json(Object.values(services));
  }
});

// Start the service registry server
app.listen(PORT, () => {
  console.log(`Service Registry running on port ${PORT}`);
});

module.exports = app;

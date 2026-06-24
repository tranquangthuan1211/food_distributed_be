require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swaggerDef');

const { connectMongoDB } = require('./config/mongodb');
const redisClient = require('./config/redis');
const { connectCassandra } = require('./config/cassandra');
const { connectNeo4j } = require('./config/neo4j');

const userRoutes = require('./routes/userRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const statsRoutes = require('./routes/statsRoutes');
const graphRoutes = require('./routes/graphRoutes');
const userOrderRoutes = require('./routes/userOrderRoutes');

const app = express();
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/users/:id/orders', userOrderRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api', graphRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Food Delivery API is running', docs: '/api-docs' });
});

async function startServer() {
  // Connect MongoDB
  try {
    await connectMongoDB();
  } catch (err) {
    console.warn('MongoDB connection failed:', err.message);
  }

  // Connect Redis (lazyConnect - just test with ping)
  try {
    await redisClient.ping();
    console.log('Redis ping successful');
  } catch (err) {
    console.warn('Redis connection failed:', err.message);
  }

  // Connect Cassandra
  try {
    await connectCassandra();
  } catch (err) {
    console.warn('Cassandra connection failed:', err.message);
  }

  // Connect Neo4j
  try {
    await connectNeo4j();
  } catch (err) {
    console.warn('Neo4j connection failed:', err.message);
  }

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
  });
}

startServer();

module.exports = app;

const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'password'
  )
);

async function connectNeo4j() {
  await driver.verifyConnectivity();
  console.log('Neo4j connected');

  const session = driver.session();
  try {
    await session.run('CREATE CONSTRAINT user_id IF NOT EXISTS FOR (u:User) REQUIRE u.userId IS UNIQUE');
    await session.run('CREATE CONSTRAINT restaurant_id IF NOT EXISTS FOR (r:Restaurant) REQUIRE r.restaurantId IS UNIQUE');
    await session.run('CREATE CONSTRAINT food_id IF NOT EXISTS FOR (f:Food) REQUIRE f.foodId IS UNIQUE');
    console.log('Neo4j constraints ready');
  } finally {
    await session.close();
  }
}

module.exports = { driver, connectNeo4j };

const cassandra = require('cassandra-driver');
const { v4: uuidv4 } = require('uuid');

const client = new cassandra.Client({
  contactPoints: (process.env.CASSANDRA_CONTACT_POINTS || 'localhost').split(','),
  localDataCenter: 'datacenter1',
  keyspace: undefined,
});

async function connectCassandra() {
  await client.connect();
  console.log('Cassandra connected');

  const keyspace = process.env.CASSANDRA_KEYSPACE || 'fooddelivery';

  await client.execute(`
    CREATE KEYSPACE IF NOT EXISTS ${keyspace}
    WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}
    AND durable_writes = true
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS ${keyspace}.order_history (
      user_id uuid,
      created_at timestamp,
      order_id uuid,
      restaurant_id uuid,
      restaurant_name text,
      items list<text>,
      total_price decimal,
      status text,
      PRIMARY KEY (user_id, created_at, order_id)
    ) WITH CLUSTERING ORDER BY (created_at DESC, order_id ASC)
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS ${keyspace}.food_stats (
      year_month text,
      food_id text,
      total_sold counter,
      PRIMARY KEY (year_month, food_id)
    ) WITH CLUSTERING ORDER BY (food_id ASC)
  `);

  console.log('Cassandra keyspace and tables ready');
}

module.exports = { client, connectCassandra };

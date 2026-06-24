const ORDER_HISTORY_DDL = `
  CREATE TABLE IF NOT EXISTS fooddelivery.order_history (
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
`;

const FOOD_STATS_DDL = `
  CREATE TABLE IF NOT EXISTS fooddelivery.food_stats (
    year_month text,
    food_id text,
    food_name text,
    restaurant_id text,
    total_sold counter,
    PRIMARY KEY (year_month, food_id)
  ) WITH CLUSTERING ORDER BY (food_id ASC)
`;

module.exports = { ORDER_HISTORY_DDL, FOOD_STATS_DDL };

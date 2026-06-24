const MERGE_USER = `MERGE (u:User {userId: $userId}) SET u.name = $name, u.email = $email RETURN u`;

const MERGE_RESTAURANT = `MERGE (r:Restaurant {restaurantId: $restaurantId}) SET r.name = $name, r.category = $category RETURN r`;

const MERGE_FOOD = `MERGE (f:Food {foodId: $foodId}) SET f.name = $name, f.price = $price RETURN f`;

const CREATE_ORDERED_REL = `MATCH (u:User {userId: $userId}), (r:Restaurant {restaurantId: $restaurantId}) MERGE (u)-[o:ORDERED_FROM {orderId: $orderId}]->(r) SET o.at = $at, o.total = $total RETURN o`;

const CREATE_FOOD_REL = `MATCH (u:User {userId: $userId}), (f:Food {foodId: $foodId}) MERGE (u)-[ate:ATE]->(f) ON CREATE SET ate.count = 1 ON MATCH SET ate.count = ate.count + 1 RETURN ate`;

const GET_RECOMMENDATIONS = `MATCH (u:User {userId: $userId})-[:ATE]->(f:Food)<-[:ATE]-(other:User)-[:ATE]->(rec:Food) WHERE NOT (u)-[:ATE]->(rec) RETURN rec.foodId AS foodId, rec.name AS name, rec.price AS price, COUNT(*) AS score ORDER BY score DESC LIMIT 10`;

const GET_USER_RESTAURANT_GRAPH = `MATCH (u:User {userId: $userId})-[o:ORDERED_FROM]->(r:Restaurant) RETURN u.name AS userName, r.restaurantId AS restaurantId, r.name AS restaurantName, r.category AS category, COUNT(o) AS orderCount, SUM(o.total) AS totalSpent ORDER BY orderCount DESC`;

module.exports = {
  MERGE_USER,
  MERGE_RESTAURANT,
  MERGE_FOOD,
  CREATE_ORDERED_REL,
  CREATE_FOOD_REL,
  GET_RECOMMENDATIONS,
  GET_USER_RESTAURANT_GRAPH,
};

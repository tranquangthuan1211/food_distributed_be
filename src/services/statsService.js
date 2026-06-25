// Fallback: Use mock data instead of Cassandra
const mockTopFoods = [
  { foodId: "food-001", foodName: "Phở Bò", restaurantId: "rest-001", totalSold: 150 },
  { foodId: "food-002", foodName: "Bánh Cuốn", restaurantId: "rest-002", totalSold: 120 },
  { foodId: "food-003", foodName: "Cơm Tấm", restaurantId: "rest-003", totalSold: 98 },
  { foodId: "food-004", foodName: "Bún Bò Huế", restaurantId: "rest-004", totalSold: 87 },
  { foodId: "food-005", foodName: "Gỏi Cuốn", restaurantId: "rest-005", totalSold: 76 },
];

async function getTopFoods(yearMonth) {
  // For demo, return mock data sorted by totalSold
  return mockTopFoods.sort((a, b) => b.totalSold - a.totalSold);
}

module.exports = { getTopFoods };

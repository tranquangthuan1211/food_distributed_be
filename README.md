# Food Delivery Backend

Hệ thống quản lý giao đồ ăn trực tuyến — Node.js + Express.js với MongoDB, Redis, Cassandra, Neo4j.

---

## Yêu cầu

- [Docker](https://www.docker.com/) + Docker Compose (khuyến nghị)
- Hoặc Node.js 20+ nếu chạy local

---

## Cách 1: Chạy bằng Docker (khuyến nghị)

### Bước 1 — Clone / vào thư mục dự án

```bash
cd food-delivery-backend
```

### Bước 2 — Tạo file .env

```bash
cp .env.example .env
```

Nội dung mặc định đã cấu hình sẵn cho Docker, không cần sửa:

```env
PORT=3000
MONGODB_URI=mongodb://mongo:27017/fooddelivery
REDIS_HOST=redis
REDIS_PORT=6379
CASSANDRA_CONTACT_POINTS=cassandra
CASSANDRA_KEYSPACE=fooddelivery
NEO4J_URI=bolt://neo4j:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password
JWT_SECRET=supersecretkey
```

### Bước 3 — Build và chạy

```bash
docker compose up --build
```

> Lần đầu sẽ mất vài phút để pull image và Cassandra khởi động.

### Bước 4 — Truy cập

| Service | URL |
|---------|-----|
| API Server | http://localhost:3000 |
| Swagger UI | http://localhost:3000/api-docs |
| MongoDB | mongodb://localhost:27017 |
| Redis | localhost:6379 |
| Cassandra | localhost:9042 |
| Neo4j Browser | http://localhost:7474 |

### Dừng ứng dụng

```bash
docker compose down
```

Xóa luôn data (volumes):

```bash
docker compose down -v
```

---

## Cách 2: Chạy local (không dùng Docker)

### Yêu cầu

Cần cài và chạy sẵn 4 database:
- MongoDB 7 — port 27017
- Redis 7 — port 6379
- Cassandra 4.1 — port 9042
- Neo4j 5 — port 7687

### Bước 1 — Cài dependencies

```bash
npm install
```

### Bước 2 — Tạo file .env và chỉnh địa chỉ localhost

```bash
cp .env.example .env
```

Sửa lại các host thành `localhost`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/fooddelivery
REDIS_HOST=localhost
REDIS_PORT=6379
CASSANDRA_CONTACT_POINTS=localhost
CASSANDRA_KEYSPACE=fooddelivery
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password
JWT_SECRET=supersecretkey
```

### Bước 3 — Chạy server

```bash
# Production
npm start

# Development (auto-reload)
npm run dev
```

---

## 12 API Endpoints

Swagger UI đầy đủ tại: **http://localhost:3000/api-docs**

| # | Method | Endpoint | Mô tả | DB |
|---|--------|----------|-------|----|
| 1 | POST | `/api/users/register` | Đăng ký tài khoản | MongoDB + Neo4j |
| 2 | POST | `/api/users/login` | Đăng nhập, nhận JWT | MongoDB + Redis |
| 3 | GET | `/api/restaurants` | Danh sách nhà hàng (cache) | Redis + MongoDB |
| 4 | POST | `/api/restaurants` | Tạo nhà hàng mới | MongoDB + Neo4j |
| 5 | GET | `/api/restaurants/:id/menu` | Menu của nhà hàng | MongoDB |
| 6 | POST | `/api/orders` | Tạo đơn hàng | MongoDB + Cassandra + Neo4j |
| 7 | PATCH | `/api/orders/:id/status` | Cập nhật trạng thái đơn | MongoDB |
| 8 | GET | `/api/users/:id/orders` | Lịch sử đơn hàng | Cassandra |
| 9 | POST | `/api/reviews` | Đánh giá nhà hàng | MongoDB |
| 10 | GET | `/api/stats/top-foods?month=2024-01` | Món bán chạy theo tháng | Cassandra |
| 11 | GET | `/api/recommendations/:userId` | Gợi ý món (collaborative filtering) | Neo4j |
| 12 | GET | `/api/graph/user-restaurant/:userId` | Quan hệ user–nhà hàng | Neo4j |

### Các endpoint cần JWT

Gửi header với mọi request cần xác thực:

```
Authorization: Bearer <token>
```

Token nhận được sau khi đăng nhập tại `/api/users/login`.

---

## Luồng test nhanh

```bash
# 1. Đăng ký user
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Nguyễn Văn A","email":"a@test.com","password":"123456","phone":"0901234567"}'

# 2. Đăng nhập lấy token
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"a@test.com","password":"123456"}'

# 3. Tạo nhà hàng (dùng token từ bước 2)
curl -X POST http://localhost:3000/api/restaurants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"Phở Hà Nội","description":"Phở truyền thống","address":"123 Lê Lợi","phone":"0909090909","category":"Vietnamese"}'

# 4. Lấy danh sách nhà hàng
curl http://localhost:3000/api/restaurants

# 5. Thống kê món bán chạy tháng 1/2024
curl http://localhost:3000/api/stats/top-foods?month=2024-01
```

---

## Cấu trúc thư mục

```
food-delivery-backend/
├── src/
│   ├── config/          # Kết nối 4 database
│   ├── models/
│   │   ├── mongodb/     # Mongoose schemas
│   │   ├── cassandra/   # DDL schemas
│   │   └── neo4j/       # Cypher query constants
│   ├── services/        # Business logic
│   ├── controllers/     # Xử lý request/response
│   ├── routes/          # Định nghĩa routes + Swagger docs
│   ├── middleware/      # JWT auth
│   ├── swagger/         # Swagger config
│   └── app.js           # Entry point
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── package.json
```

---

## Database theo nghiệp vụ

| Database | Dùng cho |
|----------|----------|
| **MongoDB** | User, Restaurant, Menu, Order, Review — dữ liệu chính |
| **Redis** | Session JWT (TTL 24h), Cache danh sách nhà hàng (TTL 5 phút) |
| **Cassandra** | Lịch sử đơn hàng theo user (time-series), Thống kê món bán chạy (counter) |
| **Neo4j** | Quan hệ User–Restaurant–Food, Gợi ý món (collaborative filtering) |

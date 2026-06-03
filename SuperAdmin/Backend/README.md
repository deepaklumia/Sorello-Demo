# SaaS POS Platform - Super Admin Backend REST API

This is a production-ready REST API for a SaaS POS platform with a Super Admin module. It follows a **Clean Architecture** directory structure, utilizing TypeScript, Node.js, Express, PostgreSQL, and Prisma ORM.

## Tech Stack
* **Runtime**: Node.js (v20+)
* **Framework**: Express.js
* **Language**: TypeScript
* **Database & ORM**: PostgreSQL, Prisma ORM
* **Authentication**: JWT, bcryptjs
* **Validation**: Zod
* **Documentation**: Swagger OpenAPI 3.0.0

---

## Folder Structure

```
SuperAdmin/Backend/
├── prisma/
│   ├── schema.prisma             # Database schema definition
│   └── seed.ts                   # Seeding script for mock data
├── src/
│   ├── app.ts                    # Express application configuration
│   ├── server.ts                 # Server startup and signal listeners
│   ├── config/
│   │   ├── database.ts           # Prisma database client
│   │   └── env.ts                # Environment configurations
│   ├── constants/
│   │   └── index.ts              # Custom error constants
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── restaurant.controller.ts
│   │   ├── order.controller.ts
│   │   └── analytics.controller.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts    # JWT/RBAC security guards
│   │   ├── error.middleware.ts   # Global exception formatter
│   │   └── validate.middleware.ts # Zod validation validation
│   ├── routes/
│   │   ├── index.ts              # Main router index
│   │   ├── auth.routes.ts        # Auth routes
│   │   ├── restaurant.routes.ts  # Restaurant manager routes
│   │   ├── order.routes.ts       # Order auditor routes
│   │   └── analytics.routes.ts   # Performance analytics routes
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── restaurant.service.ts
│   │   ├── order.service.ts
│   │   └── analytics.service.ts
│   ├── utils/
│   │   ├── api-error.ts          # Structured ApiError constructor
│   │   ├── api-response.ts       # Standard success response formatter
│   │   ├── pagination.ts         # Math logic for database pagination
│   │   └── swagger.ts            # Swagger specs object
│   └── validators/
│       ├── auth.validator.ts     # Auth payload validators
│       ├── restaurant.validator.ts # Restaurant payload validators
│       └── order.validator.ts    # Order payload validators
├── package.json
└── tsconfig.json
```

---

## Setup & Running Instructions

### 1. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your postgres database connection details and JWT secret.
```bash
cp .env.example .env
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Generate Prisma client & Run Migrations
Generate Prisma types and run local Postgres database migrations.
```bash
# Generate Prisma types
npx prisma generate

# Create and execute DB migrations
npx prisma migrate dev --name init
```

### 4. Seed Database
Seed the PostgreSQL database with mock Super Admins, Restaurants, and Orders spread across the past 40 days:
```bash
npx prisma db seed
```

### 5. Run the Server
* **Development Mode** (with hot-reload):
  ```bash
  npm run dev
  ```
* **Production Mode** (compile and start):
  ```bash
  npm run build
  npm start
  ```

---

## API Request & Response Examples

The server hosts an interactive Swagger playground at `/api-docs` (e.g. `http://localhost:5001/api-docs`).

### 1. Authentication

#### Register Super Admin
* **Endpoint**: `POST /api/auth/register`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "email": "admin@sasspos.com",
    "passwordPlain": "admin123",
    "name": "Super Admin",
    "role": "SUPER_ADMIN"
  }
  ```
* **Response**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "id": "e0e8984d-2a1c-4b77-8051-4095a4fa4316",
      "email": "admin@sasspos.com",
      "name": "Super Admin",
      "role": "SUPER_ADMIN"
    }
  }
  ```

#### Login
* **Endpoint**: `POST /api/auth/login`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "email": "admin@sasspos.com",
    "password": "admin123"
  }
  ```
* **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "e0e8984d-2a1c-4b77-8051-4095a4fa4316",
        "email": "admin@sasspos.com",
        "name": "Super Admin",
        "role": "SUPER_ADMIN"
      }
    }
  }
  ```

---

### 2. Restaurant Management
*All restaurants routes require JWT Token in the Authorization header: `Authorization: Bearer <token>`*

#### Get All Restaurants (Paginated & Filtered)
* **Endpoint**: `GET /api/admin/restaurants?page=1&limit=5&search=Burger&status=ACTIVE`
* **Response**:
  ```json
  {
    "success": true,
    "message": "Restaurants retrieved successfully",
    "data": [
      {
        "id": "f8c37d6e-1b2c-4a3b-8c9d-0e1f2a3b4c5d",
        "name": "Burger Palace",
        "email": "info@burgerpalace.com",
        "phone": "+15550101",
        "address": "101 Burger Ave, Food City",
        "status": "ACTIVE",
        "subscriptionPlan": "premium",
        "createdAt": "2026-06-03T15:00:00.000Z",
        "updatedAt": "2026-06-03T15:00:00.000Z",
        "deletedAt": null
      }
    ],
    "meta": {
      "page": 1,
      "limit": 5,
      "totalCount": 1,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  }
  ```

#### Get Restaurant Details
* **Endpoint**: `GET /api/admin/restaurants/f8c37d6e-1b2c-4a3b-8c9d-0e1f2a3b4c5d`
* **Response**:
  ```json
  {
    "success": true,
    "message": "Restaurant retrieved successfully",
    "data": {
      "id": "f8c37d6e-1b2c-4a3b-8c9d-0e1f2a3b4c5d",
      "name": "Burger Palace",
      "email": "info@burgerpalace.com",
      "phone": "+15550101",
      "address": "101 Burger Ave, Food City",
      "status": "ACTIVE",
      "subscriptionPlan": "premium",
      "createdAt": "2026-06-03T15:00:00.000Z",
      "updatedAt": "2026-06-03T15:00:00.000Z",
      "deletedAt": null
    }
  }
  ```

#### Create Restaurant
* **Endpoint**: `POST /api/admin/restaurants`
* **Request Body**:
  ```json
  {
    "name": "Taco Corner",
    "email": "contact@tacocorner.com",
    "phone": "+15550190",
    "address": "404 Fiesta St, Austin, TX",
    "subscriptionPlan": "basic"
  }
  ```
* **Response**:
  ```json
  {
    "success": true,
    "message": "Restaurant created successfully",
    "data": {
      "id": "cd0b4904-8b1b-4f9e-ad32-26ebf8b9612c",
      "name": "Taco Corner",
      "email": "contact@tacocorner.com",
      "phone": "+15550190",
      "address": "404 Fiesta St, Austin, TX",
      "status": "ACTIVE",
      "subscriptionPlan": "basic",
      "createdAt": "2026-06-03T15:10:00.000Z",
      "updatedAt": "2026-06-03T15:10:00.000Z",
      "deletedAt": null
    }
  }
  ```

#### Update Restaurant
* **Endpoint**: `PUT /api/admin/restaurants/cd0b4904-8b1b-4f9e-ad32-26ebf8b9612c`
* **Request Body**:
  ```json
  {
    "name": "Taco Corner Premium",
    "subscriptionPlan": "premium"
  }
  ```
* **Response**:
  ```json
  {
    "success": true,
    "message": "Restaurant updated successfully",
    "data": {
      "id": "cd0b4904-8b1b-4f9e-ad32-26ebf8b9612c",
      "name": "Taco Corner Premium",
      "email": "contact@tacocorner.com",
      "phone": "+15550190",
      "address": "404 Fiesta St, Austin, TX",
      "status": "ACTIVE",
      "subscriptionPlan": "premium",
      "createdAt": "2026-06-03T15:10:00.000Z",
      "updatedAt": "2026-06-03T15:15:00.000Z",
      "deletedAt": null
    }
  }
  ```

#### Update Restaurant Status
* **Endpoint**: `PATCH /api/admin/restaurants/cd0b4904-8b1b-4f9e-ad32-26ebf8b9612c/status`
* **Request Body**:
  ```json
  {
    "status": "SUSPENDED"
  }
  ```
* **Response**:
  ```json
  {
    "success": true,
    "message": "Restaurant status updated successfully",
    "data": {
      "id": "cd0b4904-8b1b-4f9e-ad32-26ebf8b9612c",
      "name": "Taco Corner Premium",
      "email": "contact@tacocorner.com",
      "phone": "+15550190",
      "address": "404 Fiesta St, Austin, TX",
      "status": "SUSPENDED",
      "subscriptionPlan": "premium",
      "createdAt": "2026-06-03T15:10:00.000Z",
      "updatedAt": "2026-06-03T15:18:00.000Z",
      "deletedAt": null
    }
  }
  ```

#### Soft Delete Restaurant
* **Endpoint**: `DELETE /api/admin/restaurants/cd0b4904-8b1b-4f9e-ad32-26ebf8b9612c`
* **Response**:
  ```json
  {
    "success": true,
    "message": "Restaurant deleted successfully"
  }
  ```

---

### 3. Order Management
*All orders routes require JWT Token in the Authorization header: `Authorization: Bearer <token>`*

#### View All Orders (Paginated & Filtered)
* **Endpoint**: `GET /api/admin/orders?page=1&limit=2&orderStatus=COMPLETED&paymentStatus=PAID`
* **Response**:
  ```json
  {
    "success": true,
    "message": "Orders retrieved successfully",
    "data": [
      {
        "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
        "restaurantId": "f8c37d6e-1b2c-4a3b-8c9d-0e1f2a3b4c5d",
        "customerName": "John Doe",
        "totalAmount": "45.50",
        "orderStatus": "COMPLETED",
        "paymentStatus": "PAID",
        "createdAt": "2026-06-03T15:05:00.000Z",
        "restaurant": {
          "id": "f8c37d6e-1b2c-4a3b-8c9d-0e1f2a3b4c5d",
          "name": "Burger Palace"
        }
      }
    ],
    "meta": {
      "page": 1,
      "limit": 2,
      "totalCount": 10,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
  ```

#### Get Order Details
* **Endpoint**: `GET /api/admin/orders/a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d`
* **Response**:
  ```json
  {
    "success": true,
    "message": "Order details retrieved successfully",
    "data": {
      "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      "restaurantId": "f8c37d6e-1b2c-4a3b-8c9d-0e1f2a3b4c5d",
      "customerName": "John Doe",
      "totalAmount": "45.50",
      "orderStatus": "COMPLETED",
      "paymentStatus": "PAID",
      "createdAt": "2026-06-03T15:05:00.000Z",
      "restaurant": {
        "id": "f8c37d6e-1b2c-4a3b-8c9d-0e1f2a3b4c5d",
        "name": "Burger Palace",
        "email": "info@burgerpalace.com",
        "phone": "+15550101",
        "address": "101 Burger Ave, Food City"
      }
    }
  }
  ```

---

### 4. Platform Analytics

#### Dashboard Summary
* **Endpoint**: `GET /api/admin/dashboard`
* **Response**:
  ```json
  {
    "success": true,
    "message": "Dashboard statistics retrieved successfully",
    "data": {
      "totalRestaurants": 3,
      "activeRestaurants": 2,
      "totalOrders": 12,
      "todayOrders": 4,
      "totalRevenue": 745.50,
      "todayRevenue": 178.40
    }
  }
  ```

#### Revenue Analytics
* **Endpoint**: `GET /api/admin/analytics/revenue`
* **Response**:
  ```json
  {
    "success": true,
    "message": "Revenue analytics retrieved successfully",
    "data": {
      "revenueByDay": [
        { "date": "2026-06-02", "revenue": 158.00 },
        { "date": "2026-06-03", "revenue": 178.40 }
      ],
      "revenueByMonth": [
        { "month": "2026-05", "revenue": 225.00 },
        { "month": "2026-06", "revenue": 520.50 }
      ],
      "revenueByRestaurant": [
        {
          "restaurantId": "f8c37d6e-1b2c-4a3b-8c9d-0e1f2a3b4c5d",
          "restaurantName": "Burger Palace",
          "revenue": 450.50
        },
        {
          "restaurantId": "ea20b92d-cc58-4501-8302-3c871df05273",
          "restaurantName": "Sushi Zen",
          "revenue": 295.00
        }
      ]
    }
  }
  ```

#### Order Analytics
* **Endpoint**: `GET /api/admin/analytics/orders`
* **Response**:
  ```json
  {
    "success": true,
    "message": "Order analytics retrieved successfully",
    "data": {
      "orderTrendsByDay": [
        { "date": "2026-06-02", "count": 2 },
        { "date": "2026-06-03", "count": 4 }
      ],
      "orderTrendsByMonth": [
        { "month": "2026-05", "count": 4 },
        { "month": "2026-06", "count": 8 }
      ],
      "statusBreakdown": [
        { "status": "PENDING", "count": 1 },
        { "status": "ACCEPTED", "count": 0 },
        { "status": "PREPARED", "count": 0 },
        { "status": "COMPLETED", "count": 10 },
        { "status": "DECLINED", "count": 1 }
      ]
    }
  }
  ```

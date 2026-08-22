# VALA Backend — Next.js API + MongoDB

REST API lives under **`/api/v1`** using Next.js App Router route handlers and **Mongoose**.

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment

Copy `.env.example` → `.env.local` (already created with defaults):

```env
MONGODB_URI=mongodb://localhost:27017/vala
JWT_SECRET=vala-dev-secret-change-in-production
JWT_EXPIRES_IN=7d
SEED_ADMIN_PASSWORD=admin123
NEXT_PUBLIC_API_URL=/api/v1
```

### 3. Start MongoDB

Ensure MongoDB is running at `mongodb://localhost:27017/`

### 4. Seed the database

**Option A — CLI script**

```bash
npm run seed
```

**Option B — HTTP (dev only)**

```bash
curl -X POST http://localhost:3000/api/v1/seed
```

### 5. Start Next.js

```bash
npm run dev
```

---

## API Endpoints

Base URL: `http://localhost:3000/api/v1`

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/health` | Health check + DB status |
| POST | `/seed` | Seed demo data (dev only) |
| POST | `/auth/register` | Register customer |
| POST | `/auth/login` | Login → JWT token |
| GET | `/schools` | List schools (`?city`, `?state`, `?q`) |
| GET | `/schools/[slug]` | School by slug |
| GET | `/categories` | List categories |
| GET | `/categories/[slug]` | Category by slug |
| GET | `/products` | List products (filters + pagination) |
| GET | `/products/[slug]` | Product by slug |
| GET | `/reviews` | Reviews (`?product=slug`) |
| GET | `/uniform-sets` | Uniform sets (`?school=slug`) |
| GET | `/coupons/validate` | Validate coupon (`?code`, `?total`) |
| GET | `/orders` | User orders (Bearer token) |
| POST | `/orders` | Create order |
| GET | `/orders/[id]` | Order detail |
| PATCH | `/orders/[id]` | Update status (admin) |
| POST | `/orders/track` | Track by order number + email |

### Response format

```json
{
  "success": true,
  "data": {},
  "message": "Products fetched successfully"
}
```

### Product filters (`GET /products`)

`q`, `school`, `category`, `gender`, `size`, `minPrice`, `maxPrice`, `inStock`, `sort`, `page`, `limit`

---

## MongoDB Collections

- `users` — auth + roles (CUSTOMER, ADMIN, SUPER_ADMIN)
- `schools`
- `categories`
- `products` (variants embedded)
- `reviews`
- `orders`
- `uniformsets`
- `coupons`

---

## Seed accounts

| Email | Password | Role |
|-------|----------|------|
| admin@vala.com | admin123 | ADMIN |
| priya.mehta@email.com | customer123 | CUSTOMER |

---

## Project structure

```text
app/api/v1/          # Route handlers
lib/db/
  connect.ts         # Mongoose connection (cached)
  seed.ts            # Seed logic
  serializers.ts     # API response mappers
  models/            # Mongoose schemas
lib/api/
  client.ts          # Frontend Axios client
  auth.ts            # JWT + bcrypt helpers
  response.ts        # Standard API responses
scripts/seed.ts      # CLI seed runner
```

---

## Frontend integration

Use `lib/api/client.ts`:

```typescript
import { apiGet } from "@/lib/api/client";

const { data } = await apiGet("/products", { category: "shirts", page: 1 });
```

Store JWT from login in `localStorage` key `vala-token`.

---

## Next steps

- Wire storefront pages to API (replace mock data)
- Add admin CRUD routes with `requireAuth(["ADMIN"])`
- Add cart/wishlist/address persistence in MongoDB

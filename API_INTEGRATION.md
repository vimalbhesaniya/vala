# API Integration Status

## ✅ Storefront — MongoDB connected

| Feature | API |
|---------|-----|
| Schools, categories, products, search | `GET /schools`, `/categories`, `/products` |
| Product detail, reviews, related products | `GET /products/[slug]`, `/reviews` |
| Uniform sets (homepage + school) | `GET /uniform-sets` |
| Cart coupons | `GET /coupons/validate` |
| Checkout & orders | `POST /orders`, `GET /orders`, `/orders/[id]`, `/orders/track` |
| Profile & addresses | `GET/PATCH /users/me`, `/users/addresses` |
| Wishlist | Client slugs → `GET /products?slugs=` |
| Recently viewed | Client slugs → `GET /products?slugs=` |

## ✅ Admin — MongoDB connected

| Feature | API |
|---------|-----|
| Dashboard stats & revenue chart | `GET /admin/dashboard` |
| Orders list & detail + status updates | `GET /admin/orders`, `/orders/[id]`, `PATCH /orders/[id]` |
| Products CRUD | `GET/POST /admin/products`, `GET/PATCH/DELETE /admin/products/[id]` |
| Schools, categories (read) | `GET /schools`, `/categories` |
| School detail (products, sets, orders) | Catalog + admin APIs |
| Reviews moderation | `GET /admin/reviews`, `PATCH/DELETE /admin/reviews/[id]` |
| Inventory & stock adjust | `GET/PATCH /admin/inventory` |
| Customers | `GET /admin/customers` |
| Coupons CRUD | `GET/POST /admin/coupons`, `PATCH/DELETE /admin/coupons/[id]` |
| Uniform sets (read) | `GET /uniform-sets` |

## ⚠️ Client-only (by design)

Cart, wishlist slugs, school selection, recent searches — localStorage until checkout/auth.

## ⚠️ Still static (no DB model yet)

- **Banners** (`/admin/banners`) — homepage marketing content
- **Settings** (`/admin/settings`) — store config UI only

## Setup

```bash
npm install
npm run seed          # seeds MongoDB from demo data
npm run dev
```

**Customer:** `priya.mehta@email.com` / `customer123`  
**Admin:** Sign in at `/admin/login` with `admin@vala.com` / `admin123`

MongoDB: `mongodb://localhost:27017/vala`

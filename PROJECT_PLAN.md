# VALA — Project Plan

> Premium full-stack student uniform e-commerce platform

---

## 1. Current Structure

```text
VALA/
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── package.json          # Next.js 16.3, React 19, Tailwind CSS 4
├── tsconfig.json         # @/* path alias
├── next.config.ts
└── postcss.config.mjs
```

**Stack today:** Next.js App Router, TypeScript, Tailwind CSS v4, Geist fonts.

**Not yet installed:** TanStack Query, Zustand, React Hook Form, Zod, Axios, Lucide React.

---

## 2. Target Structure

```text
VALA/
├── app/
│   ├── (store)/              # Customer storefront route group
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Homepage
│   │   ├── shop/
│   │   ├── schools/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── cart/
│   │   ├── checkout/
│   │   └── account/
│   ├── admin/                # Admin panel (separate layout)
│   ├── api/                  # Next.js API routes (optional proxy)
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── common/
│   ├── layout/
│   ├── product/
│   ├── school/
│   ├── category/
│   ├── cart/
│   ├── checkout/
│   ├── account/
│   └── admin/
├── features/                 # Feature modules (hooks, services)
├── hooks/
├── lib/
│   ├── api/
│   ├── auth/
│   ├── query/
│   ├── utils/
│   └── constants/
├── store/                    # Zustand client state
├── types/
├── public/
│   └── images/
└── backend/                  # NestJS + MongoDB (Phase 8)
    └── src/
```

Folders are created **when functionality is implemented**, not upfront.

---

## 3. Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                    Next.js Frontend                      │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐ │
│  │ Server      │  │ Client       │  │ Zustand        │ │
│  │ Components  │  │ Components   │  │ (cart, school, │ │
│  │ (default)   │  │ (interactive)│  │  wishlist UI)  │ │
│  └─────────────┘  └──────────────┘  └────────────────┘ │
│         │                  │                  │          │
│         └──────────────────┼──────────────────┘          │
│                            ▼                             │
│              TanStack Query (server state)               │
│                            │                             │
└────────────────────────────┼─────────────────────────────┘
                             ▼
                    REST API (/api/v1/*)
                             │
                             ▼
              ┌──────────────────────────┐
              │   NestJS Backend       │
              │   JWT + bcrypt auth      │
              │   class-validator DTOs   │
              └────────────┬─────────────┘
                           ▼
                    MongoDB (Mongoose)
```

**Principles:**
- Server Components by default; `"use client"` only when needed
- TanStack Query for server state; Zustand for client UI state only
- Centralized API client in `lib/api/`
- No raw Axios calls in components

---

## 4. Database Model

### Core Entities

| Collection       | Key Fields |
|-----------------|------------|
| `users`         | email, passwordHash, role (CUSTOMER/ADMIN/SUPER_ADMIN), profile |
| `schools`       | name, slug, logo, city, state, description, status |
| `categories`    | name, slug, image, productCount |
| `products`      | schoolId, categoryId, name, slug, images, variants[], gender, grade, material, season, tags, status |
| `productVariants` | productId, size, color, SKU, price, comparePrice, stock, weight |
| `inventory`     | variantId, available, reserved, sold, status |
| `carts`         | userId/sessionId, items[] |
| `wishlists`     | userId, productIds[] |
| `orders`        | orderNumber, userId, items[], status, shipping, payment |
| `orderItems`    | orderId, productId, variantId, quantity, price |
| `addresses`     | userId, line1, city, state, pincode, isDefault |
| `coupons`       | code, discountType, value, expiry, usageLimit |
| `reviews`       | productId, userId, rating, comment, verified |
| `uniformSets`   | schoolId, grade, gender, products[], setPrice, individualTotal |
| `banners`       | title, image, link, position, status |
| `notifications` | userId, type, message, read |

### Relationships

```text
School → Products → Variants → Inventory
School → UniformSets → Products[]
User → Orders → OrderItems
User → Cart, Wishlist, Addresses
Product → Reviews
```

### Indexes

`slug`, `SKU`, `schoolId`, `categoryId`, product `name`, `status`, `orderNumber`, `email`

---

## 5. API Modules

Base path: `/api/v1`

| Module          | Endpoints |
|----------------|-----------|
| `auth`          | POST register, login, forgot-password, reset-password; POST logout |
| `users`         | GET/PATCH profile, GET addresses, CRUD addresses |
| `schools`       | GET list, GET :slug, POST/PATCH/DELETE (admin) |
| `categories`    | GET list, GET :slug, CRUD (admin) |
| `products`      | GET list (filters), GET :slug, CRUD (admin) |
| `inventory`     | GET list, PATCH variant stock (admin) |
| `cart`          | GET, POST add, PATCH quantity, DELETE item |
| `wishlist`      | GET, POST add, DELETE remove |
| `orders`        | GET list, GET :id, POST create, PATCH status (admin) |
| `payments`      | POST initiate, POST verify (COD + mock initially) |
| `coupons`       | GET validate, CRUD (admin) |
| `reviews`       | GET by product, POST create |
| `uniform-sets`  | GET list, GET :id, CRUD (admin) |

**Response format:**

```json
{
  "success": true,
  "data": {},
  "message": "Product fetched successfully"
}
```

---

## 6. Frontend Routes

### Storefront (`app/(store)/`)

| Route | Purpose |
|-------|---------|
| `/` | Homepage |
| `/shop` | Product listing with filters |
| `/schools` | School directory |
| `/schools/[slug]` | School collection + uniform requirements |
| `/products/[slug]` | Product detail |
| `/categories/[slug]` | Category listing |
| `/cart` | Cart page |
| `/checkout` | Checkout flow |
| `/account` | Account dashboard |
| `/account/orders` | Order history |
| `/account/orders/[id]` | Order detail + tracking |
| `/account/profile` | Profile settings |
| `/account/addresses` | Address management |
| `/account/wishlist` | Wishlist |

### Admin (`app/admin/`)

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard |
| `/admin/schools` | School CRUD |
| `/admin/products` | Product CRUD |
| `/admin/categories` | Category CRUD |
| `/admin/inventory` | Stock management |
| `/admin/orders` | Order management |
| `/admin/customers` | Customer list |
| `/admin/coupons` | Coupon management |
| `/admin/uniform-sets` | Uniform set builder |
| `/admin/reviews` | Review moderation |

---

## 7. Component Architecture

```text
components/
├── common/          Button, Badge, Input, Modal, Drawer, Skeleton, EmptyState
├── layout/          AnnouncementBar, Header, MobileNav, Footer
├── product/         ProductCard, ProductGrid, ProductGallery, SizeSelector
├── school/          SchoolCard, SchoolSelector, SchoolBadge
├── category/        CategoryCard, CategoryGrid
├── cart/            CartDrawer, CartItem, CartSummary
├── checkout/        CheckoutSteps, AddressForm, PaymentForm
├── account/         AccountNav, OrderTimeline, OrderCard
└── admin/           AdminSidebar, AdminHeader, DataTable, StatCard
```

**Rules:** Small focused components, no duplication, centralized constants and types.

---

## 8. State Management

### TanStack Query (server state)

- Products, schools, categories, orders, reviews, admin data
- Centralized query keys in `lib/query/keys.ts`

### Zustand (client state)

| Store | Purpose |
|-------|---------|
| `cart-store` | Cart items, drawer open state |
| `wishlist-store` | Wishlist product IDs |
| `school-store` | Selected school (persistent) |

Do **not** duplicate server state in Zustand.

---

## 9. Authentication

- Email + password (initial)
- JWT tokens (httpOnly cookie or Authorization header)
- Roles: `CUSTOMER`, `ADMIN`, `SUPER_ADMIN`
- Backend validates roles; never trust frontend role claims
- Architecture allows future Google OAuth and phone OTP

---

## 10. Design System

### Colors

| Token | Value |
|-------|-------|
| Primary | `#111111` |
| Background | `#FAFAF8` |
| Surface | `#FFFFFF` |
| Text | `#171717` |
| Muted | `#737373` |
| Border | `#E5E5E5` |
| Accent | `#C89B5A` |
| Success | `#2E7D32` |
| Error | `#D32F2F` |

### Typography

- Font: Geist (already configured)
- Hero: 64px desktop / 40px mobile
- Section headings: 40px desktop / 28px mobile
- Product titles: 16–18px
- Body: 14–16px

### Motion

- 150ms micro interactions
- 200ms buttons/cards
- 300ms drawers
- CSS/Tailwind first; Framer Motion only where valuable

---

## 11. Development Phases

### Phase 1 — Planning ✅
- Inspect repository
- Create PROJECT_PLAN.md

### Phase 2 — Foundation (in progress)
- Design tokens in `globals.css`
- Install dependencies
- Create `lib/`, `types/`, `store/`, demo data
- Common components (Button, Badge, Input)
- Query provider setup

### Phase 3 — Customer UI (current focus)
- AnnouncementBar, Header, Footer
- Homepage: Hero, School Selector, Categories, Best Sellers, Uniform Sets, Shop by School, Why VALA, Reviews, Newsletter

### Phase 4 — Product Experience
- `/shop` with filters
- Product detail page
- Size guide modal
- Quick add

### Phase 5 — Shopping
- Cart drawer + cart page
- Checkout flow
- Wishlist

### Phase 6 — Authentication
- Login, register, forgot password
- Account pages

### Phase 7 — Admin
- Admin layout + dashboard
- CRUD for schools, products, categories, inventory, orders, etc.

### Phase 8 — Backend
- NestJS scaffold in `backend/`
- MongoDB schemas and modules
- REST API implementation

### Phase 9 — Integration
- Connect frontend to NestJS API
- Replace mock data progressively
- Seed database with demo data

---

## 12. Demo Data

- 5 fictional schools (no real logos)
- 9 categories
- 30+ realistic uniform products
- Sample reviews, uniform sets, bestsellers

---

## 13. Quality Checklist

Before any screen is complete:

- [ ] Beautiful and premium
- [ ] Responsive (mobile-first)
- [ ] Accessible (keyboard, focus, semantic HTML)
- [ ] Loading, empty, and error states
- [ ] Touch-friendly on mobile
- [ ] No layout overflow
- [ ] Proper hover and focus states

---

## 14. Environment Variables (future)

```env
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

# Backend
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
CLOUDINARY_URL=
RAZORPAY_KEY_ID=
```

---

*Last updated: Phase 1 complete — beginning Phase 2 & 3 (homepage)*

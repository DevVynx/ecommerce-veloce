# Veloce

<div align="center">

### A full-stack e-commerce platform built with Next.js, Express, and TypeScript

[![License](https://img.shields.io/badge/license-Proprietary-9ccbfb?style=for-the-badge&labelColor=101418&color=FFFFFF)](LICENSE)

</div>

Veloce is a portfolio project that simulates a complete e-commerce platform. It demonstrates full-stack development proficiency with a modern TypeScript stack, clean architecture, and production-grade patterns.

The project is structured as a monorepo (pnpm workspace + Turbo), with a REST API backend and a Next.js frontend sharing type contracts through a common types package.

---

## Architecture

```
apps/api/        Express REST API + Prisma (PostgreSQL)
apps/web/        Next.js 16 (App Router)
packages/types/  Shared TypeScript contracts (@repo/types)
```

**API** follows a layered module pattern: controllers handle HTTP, services contain business logic, and repositories manage database operations.

**Web** uses Server Actions as the default data layer, with Zustand for client-side state and React Query for server state management.

---

## Tech Stack

| Layer           | Technology            |
| --------------- | --------------------- |
| Language        | TypeScript            |
| Web Framework   | Next.js 16            |
| API Framework   | Express.js            |
| Database        | PostgreSQL            |
| ORM             | Prisma                |
| Styling         | Tailwind CSS          |
| Client State    | Zustand               |
| Server State    | React Query           |
| Validation      | Zod                   |
| Payment         | Stripe                |
| Package Manager | pnpm                  |
| Build Tool      | Turbo                 |

---

## Features

- **Authentication** — JWT access tokens, HTTP-only refresh tokens, Google OAuth
- **Product Catalog** — Browsing with variants (size, color), filtering, and hierarchical promotions
- **Cart** — Persisted cart with quantity management and optimistic updates
- **Wishlist** — Save and manage products for later
- **Checkout** — Multi-step flow with Stripe integration (credit card, PIX, webhooks)
- **Shipping** — CEP-based shipping quote calculation
- **Coupons** — Discount coupon system (percentage, fixed amount, free shipping)
- **Orders** — Order history, detail view, and status tracking
- **User Profile** — Address management, security settings, and account preferences

---

## Key Design Decisions

- **Module pattern** — Each API feature follows controller / service / repository layering, with cross-module calls going through services only
- **Server Actions** — Default data fetching and mutation pattern on the web app, replacing manual API calls
- **Shared types** — `@repo/types` enforces end-to-end type safety between API and web, preventing contract drift
- **Zod validation** — Input validation at both API middleware and web schemas, with consistent error responses
- **Zustand over Context** — Client state uses Zustand with persistence; React Context is used only in one documented case (localized product variant selection)
- **Design tokens** — shadcn/ui semantic color tokens in OKLCH color space, with strict rules against hardcoded colors
- **Security** — JWT authentication middleware, admin role verification, validated environment variables at startup

---

## Project Structure Highlights

```
apps/api/src/
├── modules/           Feature modules (auth, cart, products, etc.)
│   ├── controllers/   HTTP layer
│   ├── services/      Business logic
│   ├── repositories/  Database operations
│   └── validators/    Zod schemas
└── shared/            Middleware, utilities, error handling

apps/web/src/
├── app/               Next.js App Router pages
└── shared/
    ├── actions/       Server Actions by feature
    ├── components/    React components by feature
    ├── hooks/         React hooks and data hooks
    ├── states/        Zustand stores
    └── schemas/       Zod validation schemas

packages/types/src/
└── Contracts/         Shared DTOs, request/response types
```

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/SeuUsuario/ecommerce-veloce-app.git
cd ecommerce-veloce-app

# Install dependencies
pnpm install

# Configure environment variables
# Create .env based on .env.example

# Run database migrations
pnpm --filter api db:migrate

# Start development servers
pnpm dev
```

---

## Responsive Layout

![Responsive layout demonstration](docs/gifs/veloceresponsivity.gif)

*The interface adapts to mobile, tablet, and desktop viewports.*

## Product Interaction

![Product card modal interaction](docs/gifs/product_modal_interaction.gif)

*Product cards reveal a detail modal on hover (desktop), showing variant selection and pricing.*

---

## License

Proprietary. See [LICENSE](LICENSE) for full details.
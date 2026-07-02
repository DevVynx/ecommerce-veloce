# API Overview

## Purpose

This guide provides a high-level understanding of the Express.js REST API architecture. For detailed implementations, see the specific guides:

- @docs/guides/API-MODULES.md - Module structure and patterns
- @docs/guides/API-SHARED.md - Middleware, utilities, and error handling
- @docs/guides/API-VALIDATION.md - Input validation with Zod
- @docs/guides/DATABASE.md - Prisma ORM, migrations, and query patterns

## Architecture Summary

```
src/
├── server.ts          # Entry point
├── app.ts             # Express setup + route registration
├── jobs/              # Cron jobs
├── modules/           # Feature modules (auth, cart, products, etc.)
└── shared/           # Shared middleware, utils, lib
```

## Server Entry Point

Starts the HTTP server and initializes cron jobs:

```typescript
import { startAllCronJobs } from "@/jobs";
import { ENV } from "@/shared/utils/env";

import { app } from "./app";

const port = ENV.PORT;

app.listen(port, () => {
  console.log(`Servidor rodando na porta http://localhost:${port}/api 🚀`);
  startAllCronJobs();
});
```

## App Setup

Express app with global middleware and route registration. See @docs/guides/API-SHARED.md for middleware details.

## Route Registration

Routes are registered under `/api` prefix:

```typescript
app.use("/api", authRouter); // → /api/auth/*
app.use("/api", productRouter); // → /api/products/*
app.use("/api", cartRouter); // → /api/cart/*
app.use("/api", couponRouter); // → /api/coupons/*
app.use("/api", userRouter); // → /api/users/*
app.use("/api", wishlistRouter); // → /api/wishlist/*
app.use("/api", shippingRouter); // → /api/shipping/*
app.use("/api", searchRouter); // → /api/search/*
app.use("/api", orderRouter); // → /api/orders/*
app.use("/api", reviewRouter); // → /api/reviews/*
```

## Environment Configuration

All environment variables are validated on startup. See @docs/guides/API-SHARED.md for the full list.

## Database

PostgreSQL with Prisma ORM. See @docs/guides/DATABASE.md for setup, migrations, and query patterns.

## Authentication Flow

JWT-based authentication with refresh tokens:

1. **Login/Register** → Access token + refresh token cookie
2. **Protected routes** → Bearer token in Authorization header
3. **Token refresh** → Exchange cookie for new access token
4. **Logout** → Clear refresh token cookie

## Error Handling

Custom HttpError classes with consistent response format. See @docs/guides/API-SHARED.md for implementation details.

### Error Response Format

```json
{
  "error": "ErrorName",
  "message": "Human readable message.",
  "code": "ERROR_CODE"
}
```

## API Response Conventions

### Success

```json
{ "data": { ... } }
```

### Error

```json
{
  "error": "ErrorName",
  "message": "Description.",
  "code": "ERROR_CODE"
}
```

### Validation Error

```json
{
  "error": "BadRequestError",
  "message": { "body": { "field": { "_errors": ["Error."] } } },
  "code": "VALIDATION_ERROR"
}
```

## Key Files

| File                      | Purpose                          |
| ------------------------- | -------------------------------- |
| `src/server.ts`           | Entry point                      |
| `src/app.ts`              | App setup + routes               |
| `src/shared/lib/db.ts`    | Prisma client                    |
| `src/shared/middlewares/` | Auth, error handling, validation |
| `src/shared/utils/`       | HttpErrors, env, productLogic    |
| `src/modules/`            | Feature modules                  |
| `src/jobs/`               | Cron jobs                        |

For detailed information, see the specific guides referenced above.

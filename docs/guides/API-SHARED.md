# API Shared

## Purpose

This guide documents the shared infrastructure used across all API modules. It covers utilities, middleware, and helpers that are used by multiple modules.

For detailed module implementation, see @docs/guides/API-MODULES.md.

## Directory Structure

```
apps/api/src/shared/
├── lib/
│   └── db.ts              # Prisma client instance
├── middlewares/
│   ├── adminOnly.ts        # Admin role verification
│   ├── auth.ts            # JWT authentication
│   ├── handleGlobalError.ts # Global error handler
│   ├── notFoundHandler.ts  # 404 handler
│   └── validation.ts       # Zod validation middleware
└── utils/
    ├── env.ts             # Environment variables
    ├── HttpErrors.ts      # Custom error classes
    ├── productLogic.ts    # Product pricing/promotion logic
    └── verifyToken.ts     # JWT verification
```

## Middleware

### Authentication Middleware

Located in `src/shared/middlewares/auth.ts`:

```typescript
export const authMiddleware: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({
      error: "UnauthorizedError",
      message: "Token não fornecido ou formato inválido.",
      code: "NO_TOKEN_PROVIDED",
    });

  const accessToken = authHeader.split(" ")[1];

  try {
    const { userId, role } = await verifyToken(accessToken, "access");
    res.locals.user = { userId, role };
    next();
  } catch {
    return res.status(401).json({
      error: "UnauthorizedError",
      message: "Token inválido.",
      code: "INVALID_TOKEN",
    });
  }
};
```

Usage in routes:

```typescript
cartRouter.get("/cart", authMiddleware, findCart);
```

### Global Error Handler

Located in `src/shared/middlewares/handleGlobalError.ts`:

- Catches HttpError instances and returns formatted response
- Logs unknown errors and returns 500

```typescript
export const handleGlobalError: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  if (error instanceof HttpError) {
    return res.status(error.status).json({
      error: error.name,
      message: error.message,
      code: error.code,
    });
  }

  console.error(error);
  return res.status(500).json({
    error: "InternalServerError",
    message: "Erro interno no servidor.",
    code: "INTERNAL_SERVER_ERROR",
  });
};
```

### Not Found Handler

Located in `src/shared/middlewares/notFoundHandler.ts`:

Returns 404 for unmatched routes.

### Validation Middleware

See @docs/guides/API-VALIDATION.md for implementation details.

## Error Handling

### HttpError Classes

Located in `src/shared/utils/HttpErrors.ts`:

```typescript
export class HttpError extends Error {
  constructor(
    public status: number,
    public name: string,
    public message: any,
    public code?: string
  ) {
    super(typeof message === "string" ? message : name);
  }
}

export class BadRequestError extends HttpError { ... }           // 400
export class UnauthorizedError extends HttpError { ... }         // 401
export class ForbiddenError extends HttpError { ... }            // 403
export class NotFoundError extends HttpError { ... }            // 404
export class ConflictError extends HttpError { ... }            // 409
export class UnprocessableEntityError extends HttpError { ... } // 422
export class InternalServerError extends HttpError { ... }      // 500
export class BadGatewayError extends HttpError { ... }          // 502
```

Usage in services:

```typescript
if (!variant) {
  throw new NotFoundError("Variant not found");
}
```

## Utilities

### Environment Variables

Located in `src/shared/utils/env.ts`:

Validates and exports environment variables on startup:

```typescript
export const ENV = {
  NODE_ENV: getEnvOrThrow("NODE_ENV"),
  PORT: getEnvOrThrow("PORT"),
  DATABASE_URL: getEnvOrThrow("DATABASE_URL"),
  IP_ADDRESS: getEnvOrThrow("IP_ADDRESS"),
  SHIPPING_ORIGIN_CEP: getEnvOrThrow("SHIPPING_ORIGIN_CEP"),
  JWT_ACCESS_SECRET: getEnvOrThrow("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: getEnvOrThrow("JWT_REFRESH_SECRET"),
  GOOGLE_CLIENT_ID: getEnvOrThrow("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: getEnvOrThrow("GOOGLE_CLIENT_SECRET"),
  MEILI_HOST: getEnvOrThrow("MEILI_HOST"),
  MEILI_MASTER_KEY: getEnvOrThrow("MEILI_MASTER_KEY"),
  STRIPE_SECRET_KEY: getEnvOrThrow("STRIPE_SECRET_KEY"),
  STRIPE_WEBHOOK_SECRET: getEnvOrThrow("STRIPE_WEBHOOK_SECRET"),
  FRONTEND_URL: getEnvOrThrow("FRONTEND_URL"),
};
```

If a required env var is missing, the app throws on startup.

### Token Verification

Located in `src/shared/utils/verifyToken.ts`:

```typescript
export async function verifyToken(token: string = "", type: "access" | "refresh") {
  if (!token) throw new UnauthorizedError("Token não fornecido.");

  const decoded = jwt.verify(
    token,
    type === "access" ? ENV.JWT_ACCESS_SECRET : ENV.JWT_REFRESH_SECRET,
  );

  const { userId, role } = decoded as {
    userId: string;
    role: string;
  };

  return { userId, role };
}
```

### Product Logic

Located in `src/shared/utils/productLogic.ts`:

Handles pricing calculations and promotion logic:

```typescript
export const productLogic = {
  calculateEnrichment(
    variant: MinimalVariantPricing,
    promotions: ProductPromotionsInput
  ): ProductEnrichment {
    // Calculates salePrice, isOnSale, isAvailable based on promotions hierarchy
  },

  applyDiscount(basePrice: Prisma.Decimal, promotion: MinimalPromotion): Prisma.Decimal {
    // Applies PERCENTAGE or FIXED discount
  },

  pickHeroVariant<T extends { offer: ProductEnrichment; stock: number }>(
    variants: T[]
  ): T | undefined {
    // Picks the best variant for display (sale first, then lowest price)
  },
};
```

Types exported:

```typescript
export type MinimalPromotion = Pick<Promotion, "type" | "discountValue">;
export type MinimalVariantPricing = Pick<
  ProductVariant,
  "price" | "stock" | "isActive"
>;
export interface ProductPromotionsInput {
  variant?: MinimalPromotion[];
  product?: MinimalPromotion[];
  category?: MinimalPromotion[];
}
export interface ProductEnrichment {
  salePrice: Prisma.Decimal;
  isOnSale: boolean;
  isAvailable: boolean;
}
```

### Database Client

Located in `src/shared/lib/db.ts`:

```typescript
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: ENV.DATABASE_URL });
const db = new PrismaClient({ adapter });

export { db };
```

## Cron Jobs

Located in `src/jobs/`:

Jobs are registered in `src/jobs/index.ts`:

```typescript
const registeredJobs = [cleanupRefreshTokensJob];

export const startAllCronJobs = () => {
  console.log("⚙️ Iniciando motor de Cron Jobs...");

  registeredJobs.forEach((job) => {
    cron.schedule(job.schedule, async () => {
      console.log(`▶️ Executando job: [${job.name}]`);
      await job.execute();
    });

    console.log(`⏱️ Job [${job.name}] agendado com sucesso (${job.schedule})`);
  });
};
```

### Job Structure

```typescript
import type { CronJob } from "@/types/CronJob";

export const myJob: CronJob = {
  name: "Job Name",
  schedule: "0 3 * * *", // cron expression
  execute: async () => {
    // job logic
  },
};
```

### Adding a New Job

1. Create job file in `src/jobs/`:

```typescript
import type { CronJob } from "@/types/CronJob";

export const myJob: CronJob = {
  name: "My Job",
  schedule: "0 * * * *", // every hour
  execute: async () => {
    /* ... */
  },
};
```

2. Register in `src/jobs/index.ts`:

```typescript
const registeredJobs = [cleanupRefreshTokensJob, myJob];
```

## Module-Specific Helpers

Helpers are utilities specific to a module and not shared across modules. See @docs/guides/API-MODULES.md for examples like `getCartSummary`.

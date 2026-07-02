# API Modules

## Overview

Each API module follows a layered architecture pattern. The standard structure is:

```
modules/{feature}/
├── controllers/    # HTTP layer (request/response)
├── services/       # Business logic
├── repositories/   # Database operations (REQUIRED)
├── routes.ts       # Express router
├── types/          # Module-specific types
├── helpers/        # Module-specific utilities
├── validators/     # Zod validation schemas
└── mappers/        # Data transformation (OPTIONAL)
```

## Request Lifecycle

```
HTTP Request
    ↓
routes.ts (middleware chain)
    ↓
controllers/ (extract data, call service)
    ↓
services/ (business logic, orchestrate repositories)
    ↓
repositories/ (Prisma queries)
    ↓
Database
    ↓
Response: Database → repository → service → controller calls mapper → HTTP Response
```

## Routes

Routes define the Express router and middleware chain:

```typescript
// routes.ts
import { Router } from "express";
import { addItem, findCart } from "@/modules/cart/controllers";
import v from "@/modules/cart/validators";
import { authMiddleware } from "@/shared/middlewares/auth";

const cartRouter: Router = Router();

cartRouter.get("/cart", authMiddleware, findCart);
cartRouter.post("/cart/items", authMiddleware, v.addItem.middleware, addItem);

export { cartRouter };
```

### Middleware Chain Order

1. `authMiddleware` - Authentication (if needed)
2. Validator middleware - Input validation with Zod
3. Controller - Request handler

For middleware implementation details, see @docs/guides/API-SHARED.md.

## Controllers

Controllers handle HTTP concerns only:

- Extract validated data from request
- Call appropriate service
- Return HTTP response with proper status codes
- Use types from `@repo/types` for responses (see @docs/guides/SHARED-TYPES.md)

```typescript
export const addItemToCart: RequestHandler = async (req, res) => {
  const { userId } = res.locals.user;
  const { productVariantId, quantity } =
    v.addItemToCart.getValidatedValues(req).body;

  const { cartItem } = await cartServices.addCartItem({
    userId,
    productVariantId,
    quantity,
  });

  return res.status(201).json({ cartItem });
};
```

## Services

Services contain business logic:

- Validate business rules
- Orchestrate repositories and other services
- Throw HttpErrors on failure (see @docs/guides/API-SHARED.md)
- Cross-module calls are expected and encouraged
- Services must never call repositories from other modules directly — always go through the other module's services

```typescript
export const addCartItem = async ({
  userId,
  productVariantId,
  quantity,
}: CreateCartItemParams) => {
  const variant = await productServices.findVariantById(productVariantId);

  if (!variant) {
    throw new NotFoundError("Variant not found");
  }

  // ... business logic
};
```

## Repositories

Repositories handle all database operations via Prisma:

- One function per database operation
- Use barrel export (`index.ts`) for clean imports
- Naming convention: verb-based (find, create, update, delete)

```typescript
// repositories/index.ts
export const cartRepositories = {
  findByUserId,
  create,
  addItem,
  // ...
};

// repositories/addItem.ts
export const addItem = async ({
  cartId,
  productVariantId,
  quantity,
}: Props) => {
  return db.cartItem.create({
    data: { cartId, productVariantId, quantity },
  });
};
```

## Validators

Validators use Zod schemas wrapped with the shared validation middleware.

**See @docs/guides/API-VALIDATION.md for implementation details.**

Summary:

- Create validator files in `validators/`
- Export validators from `validators/index.ts`
- Use `v.validatorName.middleware` in routes
- Use `v.validatorName.getValidatedValues(req)` in controllers

## Types

Modules typically define these type categories:

### ServiceParams

Parameters passed to service functions.

```typescript
export type CreateCartItemParams = {
  userId: string;
  productVariantId: string;
  quantity: number;
};
```

### Persistence / Raw Types

Data directly from database, derived from repository return types:

```typescript
export type RawCart = NonNullable<Awaited<ReturnType<typeof findCartByUserId>>>;
```

### Enriched Types

Raw data enriched with calculated fields (promotions, availability, prices):

```typescript
export type EnrichedCartItem = Omit<RawCartItem, "productVariant"> & {
  product: RawCartItem["productVariant"]["product"] & {
    variant: Omit<RawCartItem["productVariant"], "product"> & ProductEnrichment;
  };
};
```

Enriched types may also include domain-specific computed fields (e.g., `summary` on cart, `count` on wishlist).

Used by mappers to transform data for API responses.

## Mappers

Mappers transform enriched data into response DTOs. Each module exports its mappers via a barrel `index.ts` with a named object:

```typescript
// mappers/index.ts
export const cartMappers = {
  toUserCart,
  toGetCartItems,
  toCartItemDto,
};
```

```typescript
export function toCartItemDto(item: EnrichedCartItem): CartItemDto {
  return {
    id: item.id,
    quantity: item.quantity,
    product: {
      id: item.product.id,
      title: item.product.title,
      variant: {
        id: item.product.variant.id,
        price: Number(item.product.variant.price),
        // ...
      },
    },
  };
}
```

## Helpers

Helpers are module-specific utilities not used outside the module. Examples:

- `getCartSummary` - Calculates cart totals
- `tokenGenerator` - Generates auth tokens
- Product enrichment logic

## Module Examples

### Cart Module

- Controllers: getCart, addItem, removeItem, updateQuantity
- Services: Business logic, stock validation
- Repositories: Cart CRUD, item operations
- Mappers: Transform to response DTOs
- Helpers: Cart summary calculation

### Auth Module

- Controllers: register, login, logout, refresh, googleAuth
- Services: Token generation, validation
- Repositories: User queries, refresh token management
- Helpers: Token utilities, email parsing

### Products Module

- Controllers: getProducts
- Services: Enrich products with pricing and availability
- Repositories: Product queries with variants
- Mappers: Transform to catalog summary
- Helpers: Product enrichment logic

### Wishlist Module

- Controllers: getWishlist, addItem, removeItem
- Services: Wishlist business logic
- Repositories: Wishlist CRUD operations
- Mappers: Transform to response DTOs

## Adding a New Module

1. Create module structure:

   ```
   modules/newFeature/
   ├── controllers/
   ├── services/
   ├── repositories/
   ├── routes.ts
   ├── types/
   └── helpers/
       └── validators/
   ```

2. Register routes in `app.ts`

3. Follow the controller → service → repository flow

4. Use Zod for validation

5. Export types from `@repo/types` for responses

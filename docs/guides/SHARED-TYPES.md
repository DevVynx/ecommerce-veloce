# Shared Types

## Overview

The `@repo/types` package contains TypeScript types shared between the API and Web applications. This ensures type safety across the network boundary.

## Package Structure

```
packages/types/src/Contracts/
├── index.ts              # Barrel export
├── Auth/
│   ├── Requests.ts
│   └── Responses.ts
├── Cart/
│   ├── Requests.ts
│   └── Responses.ts
├── Products/
│   ├── Requests.ts
│   └── Responses.ts
├── Shipping/
│   ├── Requests.ts
│   └── Responses.ts
└── Wishlist/
    ├── Requests.ts
    └── Responses.ts
```

## Usage

Import types from `@repo/types/contracts`:

```typescript
import type { LoginRequest, LoginResponse } from "@repo/types/contracts";
import type { GetCartResponse, CartItemDto } from "@repo/types/contracts";
```

## Type Naming Conventions

### DTOs (Data Transfer Objects)

Entities returned from the API. Named with `*Dto` suffix (e.g., `CartItemDto`, `WishlistItemDto`).

### Requests

Request body types. Named with `*Request` suffix (e.g., `LoginRequest`, `AddItemToCartRequest`).

### Responses

Route response types. Named with `*Response` suffix (e.g., `GetCartResponse`, `LoginResponse`).

## Best Practices

1. **Use types from `@repo/types`** - Never recreate types manually in API or Web
2. **Keep DTOs focused** - Only include fields needed by the client
3. **Naming consistency** - Follow `*Dto`, `*Request`, `*Response` convention
4. **API generates Web types** - When the API changes a type, update `@repo/types` first

## Adding New Contracts

1. Add types to the appropriate feature folder in `packages/types/src/Contracts/`
2. Export from `Requests.ts` or `Responses.ts` in that feature
3. Re-export from `packages/types/src/Contracts/index.ts`
4. Import in API controllers and Web as needed

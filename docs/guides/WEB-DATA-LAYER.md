# Web Data Layer

## Purpose

This guide covers data fetching patterns in the web app. The app uses Server Actions as the standard approach for all data fetching.

## Decision Rules

Use these rules to decide which approach to use:

### Server Actions (Default)

Use for:

- **All Mutations** (POST, PUT, DELETE)
- **Initial Page Read** (Products, Profile, Initial Listings)
- **Filters & Pagination** (URL-based, SEO, shareable links)

## Server Actions

Server Actions are functions with `"use server"` directive at the top.

### Location

Server Actions are organized **by feature** (same pattern as API modules):

```
apps/web/src/shared/actions/
├── auth/
│   ├── login.ts
│   └── register.ts
├── cart.ts
├── wishlist.ts
└── products/
    ├── getProducts.ts
    └── getProductById.ts
```

Each feature has its own folder or file. When a feature has multiple actions, use a folder. For single actions, a file is sufficient.

### Pattern

Each action is a standalone function. Types are imported from `@repo/types/contracts`:

```typescript
// apps/web/src/shared/actions/auth/login.ts
"use server";

import type { LoginRequest, LoginResponse } from "@repo/types/contracts";
import { fetchClient } from "@/shared/utils/api/fetchClient";

export const login = async (params: LoginRequest) => {
  const { data, error } = await fetchClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: params,
  });

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
};
```

For type contracts, see @docs/guides/SHARED-TYPES.md.

### Calling Server Actions

```typescript
// In a form or component
import { login } from "@/shared/actions/auth/login";

const handleSubmit = async (data: LoginRequest) => {
  const result = await login(data);
  if (result.error) {
    // handle error
  }
  // redirect or update UI
};
```

## Key Files

| File       | Purpose        |
| ---------- | -------------- |
| `actions/` | Server Actions |

## Related Guides

- @docs/guides/SHARED-TYPES.md - Type contracts (@repo/types)
- @docs/guides/WEB-STATE.md - Zustand for client state

## Summary

| Use Case            | Approach      |
| ------------------- | ------------- |
| Login/Register      | Server Action |
| Add to Cart         | Server Action |
| Product List        | Server Action |
| Filters/Pagination  | Server Action |

Remember: When in doubt, try Server Side first.

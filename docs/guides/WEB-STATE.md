# Web State Management

## Purpose

This guide covers client-side state management using Zustand as an alternative to React Context.

## When to Use Zustand

Use Zustand when you need to access the same data in multiple places (like user data, UI state).

Instead of creating Context providers, use Zustand:

```typescript
// Instead of this:
const UserContext = create<User | null>(null);

// Use this:
const useUserStore = create<{ user: User | null }>()(...)
```

### Exception: When React Context is Acceptable

React Context is discouraged in favor of Zustand. There is **one exception** in this project:

**`ProductVariantContext`** (`shared/context/ProductVariantContext.tsx`) — used on the product detail page to share variant selection state across multiple deeply-nested sibling components (image gallery, variant selector, price display, add-to-cart button).

**Why Context was chosen over Zustand:**
- The state is transient and scoped to a single page section — not global or cross-page
- Creating a Zustand store would add unnecessary boilerplate for such localized UI state
- Context here wraps a small, isolated component tree, avoiding the re-render issues that plague app-wide context

**Rule of thumb:** If considering Context, first ask:
1. Is the state truly scoped to a single page or section (not global)?
2. Would a Zustand store be overkill for this use case?
3. Is the component tree small enough that re-renders are not a concern?

If yes to all three, Context may be acceptable. Otherwise, prefer Zustand.

## Location

Stores are located in `apps/web/src/shared/states/`.

## Pattern

```typescript
// apps/web/src/shared/states/auth.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useAuthState = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      clearUser: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
```

## When to Create a Store

Create a Zustand store when:

- Data needs to be accessed in multiple components
- You need simple state management without React Context boilerplate
- Data is client-side only (not from API)

For server-fetched data, use Server Actions or React Query instead.

## Key Files

| File            | Purpose                      |
| --------------- | ---------------------------- |
| `states/auth.ts` | Auth state with persistence |
| `states/wishlist.ts` | Wishlist state with persistence |
| `states/cart.ts` | Cart state with persistence (optimistic updates, Decimal-based summary) |

## Reference

See `apps/web/src/shared/states/auth.ts` for a complete example with persistence.

# Web Overview

## Purpose

This guide provides an overview of the Next.js 16 web application architecture, including the App Router structure, routing patterns, and core organization.

For detailed patterns, see the specific guides:

- @docs/guides/WEB-COMPONENTS.md - Component architecture and UI patterns
- @docs/guides/WEB-DATA-LAYER.md - Server Actions and React Query patterns
- @docs/guides/WEB-STATE.md - Zustand state management
- @docs/guides/DESIGN-TOKENS.md - Color system and shadcn/ui tokens
- @docs/guides/SHARED-TYPES.md - Type contracts between API and Web

## Architecture Summary

```
apps/web/src/
├── app/                         # Next.js App Router pages
│   ├── (public)/                # Public routes
│   ├── (private)/               # Protected routes
│   └── shared/                 # Shared code (only used by app)
└── shared/                      # Shared code across app
    ├── actions/                # Server actions (by feature)
    ├── components/              # React components (by feature)
    ├── hooks/                  # React hooks
    ├── schemas/                # Zod schemas
    ├── states/                  # Zustand stores
    ├── providers/              # Context providers
    ├── contexts/               # React contexts
    ├── utils/                  # Utility functions
    └── types/                  # TypeScript types
```

## Route Groups

Next.js uses route groups (folders with parentheses) to organize routes without affecting the URL.

### Public Routes

Routes accessible without authentication.

Example: Home, product pages, login, register.

### Private Routes

Routes that require authentication.

Example: Cart, wishlist, user profile, checkout.

## Server vs Client Components

Server Components are preferred by default. Use Client Components only when necessary.

### Server Components (no `"use client"`)

- Layouts
- Pages
- Static content
- Data fetching
- Metadata/SEO

### Client Components (marked with `"use client"`)

- Interactive UI (buttons, forms, modals)
- State management (useState, Zustand)
- Hooks usage
- Event handlers
- Third-party components that require client-side

### When to Use

| Server Components       | Client Components |
| ----------------------- | ----------------- |
| Layouts                 | Interactive UI    |
| Static pages            | State management  |
| Metadata/SEO            | Forms             |
| Data fetching (initial) | Event handlers    |

For data fetching, see @docs/guides/WEB-DATA-LAYER.md.
For state management, see @docs/guides/WEB-STATE.md.

## Global Styles

Uses Tailwind CSS v4 with CSS variables:

```css
/* apps/web/src/app/globals.css */
:root {
  --background: oklch(0.99 0 0);
  --foreground: oklch(0 0 0);
  --primary: oklch(0 0 0);
  --radius: 0.5rem;
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## Key Files

| File                                   | Purpose                     |
| -------------------------------------- | --------------------------- |
| `app/layout.tsx`                       | Root layout + providers     |
| `app/globals.css`                      | Tailwind v4 + CSS variables |
| `@/shared/providers/QueryProvider.tsx` | React Query setup           |
| `@/shared/utils/api/fetchClient.ts`    | API client wrapper          |

For detailed information, see the specific guides referenced above.

# Web Components

## Purpose

This guide covers the component architecture and patterns used in the web app.

## Component Location

Components are located in `apps/web/src/shared/components/`.

### Organization

Components are organized **by feature** (same pattern as Server Actions):

```
components/
├── auth/               # Feature: LoginForm, RegisterForm, etc.
├── store/              # Feature: Header, ProductCard, CartDrawer, etc.
│   ├── Header/
│   ├── ProductCard.tsx
│   └── ...
├── shadcn-ui/          # Base UI components (installed via shadcn CLI)
└── ComponentName.tsx   # Generic/shared components (e.g., BadgedIconButton)
```

Generic components that are used across features stay at the root of `components/`.

## shadcn-ui

Base UI components built on Radix UI primitives. Installed via CLI:

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
```

## Component Patterns

### Props Type

Define props with a specific type:

```typescript
type ProductCardProps = {
  product: PublicProductDto;
  grid?: boolean;
};
```

### Basic Component

```typescript
export const ComponentName = ({ prop1, prop2 }: ComponentNameProps) => {
  return (
    <div>
      {/* component markup */}
    </div>
  );
};
```

### Client Component

Add `"use client"` directive when the component needs interactivity:

```typescript
"use client";

export const ProductCard = ({ product }: ProductCardProps) => {
  // interactive logic
};
```

### Using Types

Import types from `@repo/types/contracts` if needed:

```typescript
import type { PublicProductDto } from "@repo/types/contracts";

type Props = {
  product: PublicProductDto;
};
```

## Component Checklist

When creating new components:

1. **Define props type** - Use `type ComponentNameProps = { ... }`
2. **Use `"use client"`** only when needed (interactivity, hooks, state)
3. **Import types** from `@repo/types/contracts` if needed
4. **Use shadcn-ui** for base components (Button, Dialog, Sheet, etc.)
5. **Apply design tokens** from @docs/guides/DESIGN-TOKENS.md for all colors — never hardcode hex values
5. **Prefer Server Components** unless interactivity is required

## Key Files

| File                              | Purpose               |
| --------------------------------- | --------------------- |
| `components/shadcn-ui/`           | Base UI components    |
| `components/store/`               | E-commerce components |
| `components/auth/`                | Auth components       |
| `components/BadgedIconButton.tsx` | Icon with badge       |
| `components/LoadAlert.tsx`        | Empty/loading state   |

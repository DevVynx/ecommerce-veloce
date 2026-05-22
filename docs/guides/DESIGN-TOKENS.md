# Design Tokens — Color Guide (shadcn/ui)

## Table of Contents

1. [General Structure](#1-general-structure)
2. [Tokens by Context](#2-tokens-by-context)
3. [Decision Tree](#3-decision-tree)
4. [General Rules](#4-general-rules)
5. [Practical Examples](#5-practical-examples)

---

## 1. General Structure

The design system uses CSS custom properties defined in `globals.css`. Each token has a `bg-*` / `text-*` pair that guarantees contrast in both light and dark themes.

```css
/* Example definition in :root and .dark */
:root {
  --background: oklch(0.99 0 0);
  --foreground: oklch(0 0 0);
  --primary: oklch(0 0 0);
  --primary-foreground: oklch(1 0 0);
  /* ... */
}
```

Usage in Tailwind: `bg-background`, `text-foreground`, `bg-primary`, `text-primary-foreground`, etc.

---

## 2. Tokens by Context

### 2.1 Page Foundation

| Token | Usage | Rule |
|---|---|---|
| `bg-background` | Main application background | Base of all interface, applied on `body` |
| `text-foreground` | Default text color | Primary text for paragraphs, headings, labels |

### 2.2 Containers and Boxes

| Token | Usage | Example | Rule |
|---|---|---|---|
| `bg-card` / `text-card-foreground` | Cards, panels, containers floating over the background | Product card, dashboard card, modal container | Use when an element needs to stand out from the main background |
| `bg-popover` / `text-popover-foreground` | Elements that appear "on top" of the interface | Dropdowns, tooltips, select menus, modals | Whenever an element temporarily overlays content |

### 2.3 Actions and Buttons

| Token | Usage | Example | Rule |
|---|---|---|---|
| `bg-primary` / `text-primary-foreground` | Primary action button (CTA) | "Sign In", "Checkout", "Save" | Only ONE per screen as the most important action |
| `bg-secondary` / `text-secondary-foreground` | Alternative buttons | "Cancel", "Back" | Secondary action next to primary button |
| `bg-destructive` / `text-destructive-foreground` | Dangerous or irreversible actions | "Delete Account", "Remove from Cart" | Reserved for critical states and error messages |

### 2.4 Subtle Elements

| Token | Usage | Rule |
|---|---|---|
| `bg-muted` | Discreet backgrounds, inactive tabs, soft highlight areas | Lowers the visual hierarchy of the container |
| `text-muted-foreground` | Secondary text, placeholders, captions, supporting icons | Lowers the visual hierarchy of the content |
| `bg-accent` | Hover states, user interaction on menus and lists | Visual interaction feedback |
| `text-accent-foreground` | Text on elements with accent background | Contrast over bg-accent |

### 2.5 Structure and Forms

| Token | Usage | Example |
|---|---|---|
| `border-border` | Default system border | Separators, layout divisions, container borders |
| `border-input` | Input and form specific borders | input, textarea, select |
| `ring-ring` | Focus state (focus ring) | When an input receives focus |

### 2.6 Specific Tokens

| Token | Usage | Rule |
|---|---|---|
| `sidebar-*` | Sidebar exclusive colors | Separate to avoid conflict with main content |
| `chart-*` (chart-1 to chart-5) | Reserved chart colors | Dashboards, analytics, admin charts |

---

## 3. Decision Tree

```
Which color to use?

1. Is it a page background?
   ├── Yes → bg-background
   └── No ↓

2. Is it a container/box?
   ├── Is it a card floating over the background? → bg-card
   ├── Is it a popover/dropdown/tooltip? → bg-popover
   └── No ↓

3. Is it a button?
   ├── Is it the main screen action? → bg-primary
   ├── Is it a secondary/alternative action? → bg-secondary
   ├── Is it a destructive action (delete/remove)? → bg-destructive
   └── No ↓

4. Is it a subtle/supporting element?
   ├── Needs a discreet background? → bg-muted
   ├── Is it secondary text/placeholder/caption? → text-muted-foreground
   ├── Is it a hover state? → bg-accent
   └── No ↓

5. Is it structure/border?
   ├── Generic border? → border-border
   ├── Input border? → border-input
   ├── Focus ring? → ring-ring
   └── No ↓

6. Is it something specific?
   ├── Sidebar? → sidebar-*
   ├── Chart? → chart-*
   └── Otherwise → rethink the design
```

---

## 4. General Rules

1. **Semantics over aesthetics** — Always respect the token semantics, not just the visual appearance. Do not use a color "because it looks pretty"; use the correct token for the correct context.

2. **Theme consistency** — The system must work equally well in light and dark themes. Never use hardcoded colors (fixed hex/rgb) when an equivalent token exists.

3. **Visual hierarchy** — Use `muted` to reduce visual importance, `primary` to highlight, `foreground` as the default.

4. **Destructive actions** — `destructive` is exclusive for irreversible or dangerous actions. Do not use for positive feedback or common actions.

5. **Card vs Popover** — `card` is for persistent containers on the page; `popover` is for temporary elements that overlay content.

6. **Green accent for promotions** — To highlight promotional values (discounts, free shipping, sale prices), use `text-green-600` / `bg-green-500` as a spot color. This is one of the few cases where a Tailwind utility color is acceptable, as long as it is used **only** for the promotional element itself, not for containers or broad backgrounds.

---

## 5. Practical Examples

```tsx
// ❌ Bad - hardcoded color without context
<div className="bg-[#f5f5f5] text-[#333]">
  <p>Content</p>
</div>

// ✅ Good - semantic tokens
<div className="bg-card text-card-foreground">
  <p>Content</p>
</div>
```

```tsx
// ❌ Bad - primary used where it is not the main action
<button className="bg-primary">Cancel</button>

// ✅ Good - secondary for secondary action
<button className="bg-secondary">Cancel</button>
<button className="bg-primary">Save</button>
```

```tsx
// ❌ Bad - muted used in the wrong place
<p className="text-muted-foreground">Total: $100.00</p> {/* Total is important info */}

// ✅ Good - muted only for secondary text
<p className="text-muted-foreground">Delivery time: 5 business days</p>
<p className="text-foreground font-bold">Total: $100.00</p>
```

```tsx
// ❌ Bad - destructive for a common remove item action
<button className="bg-destructive">Remove from cart</button>

// ✅ Good - destructive exclusive for truly dangerous actions
<button className="bg-destructive">Permanently delete account</button>

// Removing an item from cart is a common, non-destructive action
<button className="text-muted-foreground hover:text-destructive">
  Remove
</button>
```

```tsx
// ❌ Bad - flashy background for a supporting block
<div className="bg-amber-50 p-3">...</div>

// ✅ Good - neutral background with highlight only on the promotional element
<div className="bg-muted p-3">
  <span className="text-green-600 font-bold">$50.00</span> to free shipping
</div>
```

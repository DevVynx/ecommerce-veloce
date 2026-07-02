# Database (Prisma)

## Overview

PostgreSQL database with Prisma ORM. The complete schema with all models, relations, and enums is in @apps/api/prisma/schema.prisma.

## Database Client

Located in `src/shared/lib/db.ts`:

```typescript
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../prisma/generated/client/client";

const adapter = new PrismaPg({ connectionString: ENV.DATABASE_URL });
const db = new PrismaClient({ adapter });

export { db };
```

Usage in repositories:

```typescript
import { db } from "@/shared/lib/db";

const user = await db.user.findUnique({ where: { id } });
```

## Schema Conventions

### Primary Keys

All models use UUID: `@id @default(uuid()) @db.Uuid`

### Timestamps

Use `@default(now())` and `@updatedAt` for automatic timestamps. Store as `@db.Timestamptz` for timezone awareness.

### Naming

- Table names use snake_case: `@@map("refresh_token")`
- Relations use PascalCase in schema, snake_case in database

### Cascade Delete

Most relations use cascade delete:

```prisma
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
```

## Common Patterns

### Find with relations

```typescript
const cart = await db.cart.findUnique({
  where: { userId },
  include: {
    items: {
      include: {
        productVariant: {
          include: {
            product: true,
            promotions: true,
          },
        },
      },
    },
  },
});
```

### Create

```typescript
const cartItem = await db.cartItem.create({
  data: { cartId, productVariantId, quantity },
  omit: { createdAt: true, updatedAt: true },
});
```

### Update

```typescript
await db.cartItem.update({
  where: { id: cartItemId },
  data: { quantity },
});
```

### Delete

```typescript
await db.cartItem.delete({ where: { id: cartItemId } });
```

### Upsert

```typescript
await db.cartItem.upsert({
  where: { cartId_productVariantId: { cartId, productVariantId } },
  create: { cartId, productVariantId, quantity },
  update: { quantity },
});
```

## Transactions

For multi-step operations:

```typescript
const result = await db.$transaction(async (tx) => {
  const order = await tx.order.create({ data: orderData });
  await tx.orderItem.createMany({ data: items });
  await tx.cartItem.deleteMany({ where: { cartId } });
  return order;
});
```

## Seed Data

```bash
pnpm --filter api db:seed
pnpm --filter api db:seed-many
```

## Query Optimization

### Select only needed fields

```typescript
await db.user.findMany({
  select: { id: true, name: true },
});
```

### Pagination

```typescript
await db.product.findMany({
  take: limit,
  skip: offset,
  orderBy: { createdAt: "desc" },
});
```

## Reference

See @apps/api/prisma/schema.prisma for complete schema with all models, relations, and enums (OrderStatus, PromotionTypes).

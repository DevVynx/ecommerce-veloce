# API Validation

## Overview

All API inputs must be validated using Zod schemas wrapped with the shared validation middleware. This ensures type safety and consistent error handling across all endpoints.

## Quick Implementation

### 1. Create Validator File

Create a file in `modules/{feature}/validators/`:

```typescript
// modules/cart/validators/addItemToCart.ts
import z from "zod";
import { validation } from "@/shared/middlewares/validation";

const body = z.object({
  productVariantId: z.uuid("Valor inválido."),
  quantity: z
    .number("Valor inválido.")
    .min(1, "A quantidade mínima é 1."),
});

export const addItemToCart = validation({ body });
```

### 2. Export from Index

```typescript
// modules/cart/validators/index.ts
import { addItemToCart } from "./addItemToCart";
import { removeItemFromCart } from "./removeItemFromCart";
import { updateCartItemQuantity } from "./updateCartItemQuantity";

const validations = {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
};

export default validations;
```

### 3. Use in Routes

```typescript
// modules/cart/routes.ts
import v from "@/modules/cart/validators";

cartRouter.post(
  "/cart/items",
  authMiddleware,
  v.addItemToCart.middleware,
  addItemToCart,
);
```

### 4. Access Validated Data in Controller

```typescript
// modules/cart/controllers/addItemToCart.ts
export const addItemToCart: RequestHandler = async (req, res) => {
  const { userId } = res.locals.user;
  const { productVariantId, quantity } =
    v.addItemToCart.getValidatedValues(req).body;

  // data is already typed and validated
  const { cartItem } = await cartServices.addCartItem({
    userId,
    productVariantId,
    quantity,
  });

  return res.status(201).json({ cartItem });
};
```

## Supported Properties

You can validate any request part:

```typescript
const schema = z.object({
  body: z.object({ ... }),
  query: z.object({ ... }),
  params: z.object({ ... }),
  headers: z.object({ ... }),
});

export const myValidator = validation(schema);
```

## Common Zod Patterns

For the complete Zod API, see https://zod.dev/api

### UUID

```typescript
z.uuid("ID inválido.");
```

### String with constraints

```typescript
z.string().min(1, "Obrigatório.").max(255, "Muito longo.");
```

### Number coercion and validation

```typescript
z.coerce.number("Valor inválido.").min(1).max(100);
```

### Enums

```typescript
z.enum(["PENDING", "PAID", "SHIPPED"]);
```

### Optional fields

```typescript
z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
});
```

### Arrays

```typescript
z.array(z.uuid()).min(1, "Pelo menos um item.");
```

### Custom validation

```typescript
z.string().refine((val) => val.startsWith("BR-"), {
  message: "Código deve começar com 'BR-'.",
});
```

## Error Response Format

On validation failure, the API returns:

```json
{
  "error": "BadRequestError",
  "message": {
    "body": {
      "productVariantId": { "errors": ["ID inválido."] },
      "quantity": { "errors": ["A quantidade mínima é 1."] }
    }
  },
  "code": "VALIDATION_ERROR"
}
```

## Best Practices

1. **One validator per endpoint** - Create a new file for each endpoint's validation
2. **Descriptive error messages** - Messages should help the client understand what went wrong
3. **Use `coerce.number()` for numeric inputs** - Request params come as strings
4. **Validate at the boundary** - Validation happens in middleware before the controller runs
5. **Keep validators with their modules** - Don't create a shared validators folder

## Reference

- @docs/guides/API-MODULES.md - Module structure where validators live
- @docs/guides/API-SHARED.md - Validation middleware implementation

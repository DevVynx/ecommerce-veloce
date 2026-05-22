# Guide Corrections Report (docs/guides/)

**Date**: 2026-04-29  
**Author**: opencode (big-pickle)  
**Scope**: Updated guides to reflect the current codebase state

---

## Executive Summary

Discrepancies between the documentation guides and the current project code were identified and corrected. The `shipping` module was ignored as requested (it will be refactored in the future). The focus was aligning examples, naming conventions, and directory structures.

---

## 1. WEB-STATE.md

### Issues Identified:
- **File naming**: Guide showed `useExample.ts` (with `use` prefix), but current code uses `auth.ts` and `wishlist.ts` (no `use` prefix)
- **Reference file**: Mentioned `states/useUser.ts` which does not exist
- **Store example**: Showed `useExampleStore`, but code uses `useAuthState`, `useWishlistState`, `useAuthMutex`
- **Persistence**: Did not mention the use of `persist` from zustand/middleware, which is used in `auth.ts` and `wishlist.ts`

### Corrections Applied:
1. Updated the Pattern example to show `auth.ts` with `useAuthState` and `persist` usage
2. Updated the **Key Files** section to list `states/auth.ts` and `states/wishlist.ts`
3. Updated the **Reference** section to point to `states/auth.ts`

### Before vs After:

**Before:**
```typescript
// apps/web/src/shared/states/useExample.ts
export const useExampleStore = create<ExampleStore>(...)
```

**After:**
```typescript
// apps/web/src/shared/states/auth.ts
export const useAuthState = create<AuthState>()(
  persist(...)
)
```

---

## 2. WEB-COMPONENTS.md

### Issues Identified:
- **`checkout/` directory**: Mentioned in the structure as a feature, but does not exist in the codebase
- **`store/` structure**: Guide showed it as flat files, but the codebase has subfolders (`Header/`, `ProductDetailsModal/`, etc.) and direct files

### Corrections Applied:
1. Removed the `├── checkout/           # Feature: CheckoutForm, AddressForm, etc.` line from the structure
2. Updated the `store/` structure to show it can have subfolders:
   ```
   ├── store/              # Feature: Header, ProductCard, CartDrawer, etc.
   │   ├── Header/
   │   ├── ProductCard.tsx
   │   └── ...
   ```

---

## 3. WEB-FORMS.md

### Issues Identified:
- **`checkout/` directory**: Mentioned in the schema structure, but `schemas/checkout/` does not exist
- **Key Files**: File list was correct, only the visual reference to checkout was removed

### Corrections Applied:
1. Removed the `├── checkout/` section from the schema structure:
   ```
   schemas/
   ├── auth/
   │   ├── loginForm.ts
   │   └── registerForm.ts
   └── cep.ts
   ```
2. Kept the **Key Files** table unchanged (files actually exist)

---

## 4. API-MODULES.md

### Issues Identified:
- **Repositories required**: Guide did not make it clear that `repositories/` is required (the `shipping/` module does not have one, but it will be refactored)
- **Shipping Module**: Was absent from the "Module Examples" section, but as requested, should be ignored
- **Default structure**: Stated that `mappers/` was optional (correct), but did not emphasize that `repositories/` is required

### Corrections Applied:
1. Updated the default structure to indicate `repositories/` is **REQUIRED**:
   ```
   ├── repositories/     # Database operations (REQUIRED)
   ```
2. Kept the indication that `mappers/` is optional
3. Added **Wishlist Module** section to the examples (was missing)
4. Removed any implicit mention of the `shipping` module as a standard example

### Added Example - Wishlist Module:
```
### Wishlist Module

- Controllers: getWishlist, addItem, removeItem
- Services: Wishlist business logic
- Repositories: Wishlist CRUD operations
- Mappers: Transform to response DTOs
```

---

## 5. API-VALIDATION.md

### Status: ✅ No changes needed

- The use of `z.uuid()` is present in both the guide and the current code
- Note: `z.uuid()` is not standard in Zod v3, appears to be a custom project extension. Both (guide and code) are consistent.

---

## 6. Other Guides (Unchanged)

The following guides were verified and are consistent with the current code:

- ✅ **WEB-OVERVIEW.md**: Correct structure, mentioned files exist
- ✅ **WEB-DATA-LAYER.md**: Server Actions and React Query structure correct
- ✅ **API-OVERVIEW.md**: Routes and structure correct
- ✅ **API-SHARED.md**: Middlewares and utilities correct
- ✅ **DATABASE.md**: Prisma client and patterns correct
- ✅ **SHARED-TYPES.md**: Contracts structure correct

---

## Changed Files

| File | Changes |
|------|---------|
| `docs/guides/WEB-STATE.md` | Updated Pattern example, Key Files and Reference |
| `docs/guides/WEB-COMPONENTS.md` | Removed `checkout/`, updated `store/` structure |
| `docs/guides/WEB-FORMS.md` | Removed `checkout/` from schema structure |
| `docs/guides/API-MODULES.md` | Emphasized `repositories/` as required, added Wishlist example |

---

## Post-Correction Consistency Check

After corrections, all guides now:
1. ✅ Reflect actual file names in the codebase
2. ✅ Show the correct directory structure
3. ✅ Do not mention the `shipping` module as an example
4. ✅ Emphasize that `repositories/` is required in API modules
5. ✅ Include information about Zustand persistence (when applicable)

---

## Developer Notes

- The `shipping` module should be ignored in documentation until it is refactored
- Whenever creating a new API module, make sure to include the `repositories/` folder
- Zustand stores on the frontend may or may not use `persist` — check existing files for examples
- The `z.uuid()` extension in Zod is custom to this project and should be kept consistent between code and documentation

---

**End of Report**

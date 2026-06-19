# Project State

**Last Updated**: 2026-06-18
**State Expiration**: N/A

---

## Current Task

**[vyn-051] Criar módulo de sugestões de busca populares** — Completed

### Changes
- **`prisma/schema.prisma`**: Modelo `SearchSuggestion` com `term` (unique) e `searchCount`, mapeado pra `search_suggestions`
- **Novo módulo `modules/search/`**: Rota `POST /api/search/analytics` com validação, service, repository
- **`infra/search/`**: Método `addDocuments()` adicionado à interface `SearchEngine` e implementado no `MeilisearchAdapter`
- **`scripts/`**: Todos os scripts operacionais (seed, sync-search, setup-search) centralizados na pasta `scripts/` (movidos de `prisma/`)
- **Contracts**: Types `RegisterAnalyticsRequest` e `RegisterAnalyticsResponse` em `Contracts/Search/`

---

## Recent Important Decisions

> Decisions older than 30 days are automatically expired and should be removed.

### [Task] Popular Search Suggestions Module

- **Date**: 2026-06-18
- **Decision**: Created a separate `modules/search/` module for search analytics, distinct from the product search route (`GET /products/search` which stays in `modules/products/`).
- **Architecture**:
  - `POST /api/search/analytics` receives `{ term }`, upserts in Prisma, pushes to Meili index `suggestions`
  - Prisma tracks the canonical `searchCount`, Meili uses `searchCount:desc` ranking rule for trending
  - `addDocuments()` added to `SearchEngine` interface — adapter is the single point for writing to Meili
  - Setup script `scripts/setup-search.ts` configures the `suggestions` index (ranking rules), run via `pnpm --filter api search:setup`
- **Scripts**: All operational scripts moved from `prisma/` to `scripts/` for better organization:
  - `scripts/seed.ts`, `scripts/seed-many.ts`, `scripts/sync-search.ts`, `scripts/setup-search.ts`

### [Task] Meilisearch Full-Text Search

### [Task] Product Enrichment Refactoring — Offer Value Object

- **Date**: 2026-05-22
- **Decision**: Replace spread enrichment pattern (`{ ...variant, salePrice, isOnSale, isAvailable }`) with an `offer` value object (`{ ...variant, offer: { salePrice, isOnSale, isAvailable } }`) across all API modules.
- **Why**: Previously, adding a single enrichment field required editing 5 services + 5 type files + helpers. With `offer` namespaced under `variant`, the type is simply `RawVariant & { offer: ProductEnrichment }`, and new fields only touch `ProductEnrichment` + `calculateEnrichment`.
- **Scope**: Products (list/detail), Cart, Wishlist — all enrichment flows updated.
- **Types**: Replaced `Persistence.ts`/`Enriched.ts` split with single files per domain (`ProductList.ts`, `ProductDetail.ts`, `Cart.ts`, `Wishlist.ts`). All raw types use `NonNullable`. PascalCase filenames.

### [Task] Decimal.js for Monetary Arithmetic

- **Date**: 2026-05-20
- **Decision**: Added `decimal.js` for all monetary calculations on the frontend
- **Why**: JavaScript `number` (IEEE 754) causes precision errors (e.g., `19.99 * 3 = 59.970000000000006`). Money must never be calculated with floats.
- **Created utility**: `@/shared/utils/store/price.ts` with `asDecimal()`, `formatPrice()`, `formatDiscount()`, `calculateDiscountPercent()`
- **Impact**: All price displays now use `formatPrice()`, all arithmetic uses `Decimal` internally via `calculateSummary()` and `CouponApplier`

### [Task] Fixed Cart Summary Semantics

- **Date**: 2026-05-20
- **Decision**: Fixed `calculateSummary` in Zustand cart store to match API behavior
- **Semantics** (before → after):
  - `subtotal`: was `Σ(salePrice)` (discounted) → now `Σ(price)` (base, matches API)
  - `total`: was `subtotal` (copy) → now `Σ(salePrice)` (effective, matches API)
  - `discount`: `retailPrice - effectivePrice` (same as before, now computed via `Decimal`)
- **Impact**: `CartSummary.tsx`, `CartDropdown.tsx`, `CartMobileSummaryDrawer.tsx` all now show correct values. Free shipping threshold uses `total` (effective price).

---

## Expiration Rules

1. Decisions older than 30 days should be removed
2. When a decision is no longer relevant, archive it
3. Update "Last Updated" date when any change is made

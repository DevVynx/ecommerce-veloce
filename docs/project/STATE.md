# Project State

**Last Updated**: 2026-07-10
**State Expiration**: N/A

---

## Current Task

**[vyn-053] Admin — Cupons (CRUD listagem + criação + exclusão)** — In Progress

### Scopo
- Listagem de cupons com busca, filtros, ordenação, paginação
- Criação de cupom via Sheet/Drawer com formulário completo
- Exclusão de cupom com Dialog de confirmação (oculto se já usado)
- `useInvalidate` hook para invalidação reativa de queries

### Changes (Web)
- **`shared/utils/date/dateTimeISO.ts`**: `add30Min`, `toBrazilISOString`, `parseISOToDateAndTime`
- **`shared/components/Admin/Coupons/`**: `CouponTable`, `CouponFilters`, `CreateCouponSheet`, `CreateCouponForm`, `CouponDiscountFields`, `CouponSummaryTicket`, `CurrencyInput`, `DateTimePicker`
- **`shared/schemas/coupons.ts`**: Schema Zod com `superRefine` condicional
- **`shared/actions/coupons/`**: `createCoupon`, `deleteCoupon` server actions
- **`shared/hooks/lib/useInvalidate.ts`**: Hook que centraliza `queryClient.invalidateQueries`
- **`app/(private)/admin/coupons/page.tsx`**: Página com URL state (nuqs), CreateCouponSheet, CouponTable com delete

### Changes (Types)
- **`packages/types/Contracts/Coupon/`**: `AdminSearchCouponsRequest/Response`, `AdminCouponDto`, `DeleteCouponResponse`

### Changes (API)
- **`modules/coupon/`**: CRUD completo (controllers, services, repositories, validators, routes)
- `DELETE /admin/coupons/:id` — valida UUID, 404 se não existe, 422 se já usado, 204 success

### Blocked
- `GET /admin/promotions/search` e `GET /admin/coupons/search` endpoints não existem (retornam 404)

---

## Recent Important Decisions

### [Task] Admin Coupons — DateTimePicker + Exclusão

- **Date**: 2026-07-10
- **Decision**: 
  - DateTimePicker sem portal (`PopoverContentNoPortal`) para funcionar dentro de Sheet/Drawer
  - Fim sempre +30min depois do início (nunca mesmo horário), sem botão "Agora"
  - Exclusão oculta quando `usageCount > 0`; Dialog de confirmação com estado loading
  - `useInvalidate` hook para substituir `useQueryClient` direto nos componentes
  - Schema usa `z.number()` (não `z.coerce.number()`) com `superRefine` para validação condicional (`endsAt > startsAt`, `value` required quando PERCENTAGE/FIXED)

---

## Melhorias Não Implementadas

Ver `docs/project/KNOWN-LIMITATIONS.md` para a lista completa de funcionalidades conscientemente deixadas de fora (stock, PIX, e-mail, admin, reviews, cache, testes, CI/CD, etc.).

## Expiration Rules

1. Decisions older than 30 days should be removed
2. When a decision is no longer relevant, archive it
3. Update "Last Updated" date when any change is made

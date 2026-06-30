# Project State

**Last Updated**: 2026-06-27
**State Expiration**: N/A

---

## Current Task

**[vyn-052] Implementar fluxo de checkout com pagamento Stripe** — Completed

### Changes
- **`modules/order/`**: Novo módulo completo (controllers, services, repositories, validators, types, routes)
- **`modules/webhook/`**: Novo módulo para webhook Stripe com verificação de assinatura
- **`infra/payment/stripe.ts`**: Instância Stripe singleton
- **`prisma/schema.prisma`**: Order model ganhou campos `discount`, `contribution`, `paymentMethod`
- **`cart/services/clearCart.ts`** + **`cart/repositories/clearCart.ts`**: Limpa carrinho por userId (ownership check)
- **`env.ts`**: Adicionado `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `FRONTEND_URL`
- **`app.ts`**: Webhook route movido pra antes do `express.json()` com `express.raw()`
- **User module**: Refatorado barrel exports (`addressServices` → `userServices`, `addressRepositories` → `userRepositories`)
- **Profile**: `getProfile` service + `findUserProfile` repo movidos de `auth` para `user`
- **Auth response types**: Unificados com `UserProfile` (inclui `role`, `isEmailVerified`, `createdAt`)
- **Order contracts**: `CreateOrderRequest`, `CreateOrderResponse`, `OrderDto` em `Contracts/Order/`
- **Checkout frontend**: PaymentSelector + ReviewOrder components, `paymentMethod` no state, success page
- **Search scripts**: Usam `ENV` object em vez de `process.env` direto

---

## Recent Important Decisions

### [Task] Checkout Flow with Stripe Payment

- **Date**: 2026-06-27
- **Decision**: Stripe Checkout Session (redirect), sem SDK no frontend, valor fixo em R$ 3 (demo).
- **Architecture**:
  - `POST /api/orders` cria pedido + Stripe session, retorna `paymentUrl` para redirect
  - `POST /api/orders/webhook` com `express.raw()` antes do `express.json()` para verificação de assinatura
  - Webhook escuta `checkout.session.completed` e atualiza status para `PAID`
  - `createOrder` aceita `addressId` (endereço salvo) OU `shippingAddress` (não salvo) via Zod `.refine()`
  - Cart é limpo imediatamente após criação da Stripe session (antes da confirmação)
  - `clearCart` recebe só `userId`, faz ownership check internamente

### [Task] Popular Search Suggestions Module

- **Date**: 2026-06-18
- **Decision**: Created a separate `modules/search/` module for search analytics, distinct from the product search route (`GET /products/search` which stays in `modules/product/`).
- **Architecture**:
  - `POST /api/search/analytics` receives `{ term }`, upserts in Prisma, pushes to Meili index `suggestions`
  - Prisma tracks the canonical `searchCount`, Meili uses `searchCount:desc` ranking rule for trending
  - `addDocuments()` added to `SearchEngine` interface — adapter is the single point for writing to Meili
  - Setup script `scripts/setup-search.ts` configures the `suggestions` index (ranking rules), run via `pnpm --filter api search:setup`

---

## Known Issues / Next Steps

- **Pedidos PENDING nunca expiram**: Se usuário cancelar no Stripe, order fica `PENDING` pra sempre. Tratar `checkout.session.expired` no webhook.
- **Cart limpo antes da confirmação**: Se pagamento falhar, carrinho já foi. Mover `clearCart` pro webhook `completed`.
- **Stripe charge fixo (R$3)**: Não reflete o total real do pedido. Corrigir `line_items` pra usar valor dinâmico.
- **Stock validation ausente**: `createOrder` não verifica estoque antes de criar o pedido.
- **Sem transação no banco**: `createOrder` não usa `$transaction` — risco de orphan record.
- **`shippingPrice` do cliente**: Sem verificação server-side do valor do frete.
- **Async error handling**: Controllers `async` sem try/catch — Express 4 não capta rejected promises.

## Expiration Rules

1. Decisions older than 30 days should be removed
2. When a decision is no longer relevant, archive it
3. Update "Last Updated" date when any change is made

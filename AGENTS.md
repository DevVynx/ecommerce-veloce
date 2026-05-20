## Agentic Coding Guidelines for E-commerce BeliBeli

**IMPORTANT: Read this entire file before starting any task.**

**ALWAYS read `@docs/project/STATE.md` first** to check the current project state, active task, and recent decisions. Update the state file if the task context changes.

---

## Project Overview

This is a TypeScript monorepo (pnpm workspace + Turbo) containing:

- **apps/api**: Express.js REST API with Prisma ORM and PostgreSQL
- **apps/web**: Next.js 16 (App Router) frontend
- **packages/**: Shared configs and types (@repo/types)

**Stack**: TypeScript, Express, Next.js 16, Prisma, PostgreSQL, React Query, Zustand, Tailwind CSS

For more details about the project, see @docs/project/PROJECT-OVERVIEW.md

---

## CRITICAL: Use Subagents Aggressively

**Use subagents as much as possible.** When a task can be parallelized or delegated:

- Use `@explore` for codebase exploration and research
- Use `@general` for multi-step tasks and research
- Suggest creating custom subagents for repetitive workflows (ask the user first)
- Never do sequentially what can be done in parallel

This maximizes efficiency and keeps the main agent focused on coordination.

---

## CRITICAL: On-Demand Guide Loading

This repository has detailed guides in `@docs/guides/` for specific topics. You should only load these guides **when they are relevant to the task you are performing**.

### When to Load a Guide

- **Load a guide ONLY when you need information from it** to complete the user's request
- **Do NOT load a guide** just because it exists or might be related
- **Do NOT load all guides** at the start of a session
- **Load guides based on the actual task at hand**

Example:

- User asks to add a new API endpoint → Load API-MODULES.md and API-SHARED.md
- User asks to fix a CSS/styling bug on a component → Load DESIGN-TOKENS.md
- User asks to add a new React Query mutation → Load WEB-DATA-LAYER.md

### How to Load Guides

When you see a reference like `@docs/guides/API-OVERVIEW.md` or need information from a specific topic, use the Read tool:

```
Read tool → filePath: "C:\Code\Projetos-FullStack\ecommerce-belibeli\docs\guides\API-OVERVIEW.md"
```

### Recursive Loading

If a loaded guide references another guide for deeper details, load that guide too.

---

## CRITICAL: Always Ask Before Making Decisions

**STOP AND WAIT** - Não execute ações automaticamente, sempre confirme antes.

### Quando SEMPRE Perguntar

Se em qualquer momento você precisar fazer algo que não foi explicitamente solicitado, **PARE e PERGUNTE**:

- Adicionar arquivos em um commit que não foram mencionados
- Modificar código que não estava no escopo da solicitação
- Fazer operações de git (reset, stash, commit) sem confirmação explícita
- Alterar descrições de commits além do solicitado
- Reverter código antes de confirmar o escopo

### Exemplos de O que NÃO Fazer

- ❌ Usuário pede "ajustar commit" → Você adiciona mais arquivos sem perguntar quais
- ❌ Usuário pede para "voltar atrás" → Você modifica código enquanto faz o reset
- ❌ Usuário pergunta algo → Você responde sem verificar se entendeu corretamente

### Exemplos de O que FAZER

- ✅ "Posso incluir o arquivo X no commit também?"
- ✅ "Quer que eu reverte apenas o arquivo Y ou todos?"
- ✅ "Entendi corretamente que você quer fazer X com Y?"

### Regra de Ouro

> É melhor perguntar 10 vezes do que fazer 1 mudança errada.

---

## Quick Reference

### Build Commands

```bash
pnpm build          # Build all packages
pnpm dev            # Start all apps
pnpm lint           # Lint all packages
pnpm lint:fix       # Auto-fix linting
pnpm check-types    # Type check all packages

# Single package
pnpm --filter api dev
pnpm --filter web dev
pnpm --filter api db:seed
```

---

## Essential Principles

These principles **MUST** be followed in every task, regardless of context:

1. **No `any`** - Never use `any`. If really need it, use `unknown` and narrow appropriately.
2. **Strict Mode** - Always follow TypeScript strict mode rules.
3. **`type` over `interface`** - Prefer `type` for object shapes, except when interface is required.
4. **Zod validation** - Validate all inputs with Zod on both API and Web.

### Code Quality Standards

When writing code, follow these standards:

- **Security**: Never hardcode secrets, validate all inputs, enforce auth on protected routes.
- **Error Handling**: Use HttpError classes on API, proper error states on Web.
- **Patterns**: Follow the module/controller/service/repository pattern for API. Follow Server Actions + React Query pattern for Web.
- **Readability**: Clear naming, single responsibility, minimal nesting.

For detailed patterns, see the guides in @docs/guides/. For code review, use the `@pragmatic-code-review` skill.

---

## Deep-Dive Guides

### API Guides

- **@docs/guides/API-OVERVIEW.md** - Server setup, middleware, routing, error handling
- **@docs/guides/API-MODULES.md** - Module pattern, auth, cart, wishlist, products, shipping
- **@docs/guides/API-SHARED.md** - HttpErrors, middlewares, validation, auth utilities
- **@docs/guides/API-VALIDATION.md** - Zod validation patterns
- **@docs/guides/DATABASE.md** - Prisma schema, models, migrations, queries

### Web Guides

- **@docs/guides/WEB-OVERVIEW.md** - Next.js structure, routing, layouts
- **@docs/guides/WEB-COMPONENTS.md** - Radix UI, shadcn-ui, component patterns
- **@docs/guides/WEB-DATA-LAYER.md** - React Query hooks, mutations, query keys
- **@docs/guides/WEB-STATE.md** - Zustand stores, when to use vs React Query
- **@docs/guides/DESIGN-TOKENS.md** - Color system, shadcn/ui tokens, when to use each

### Shared Guides

- **@docs/guides/SHARED-TYPES.md** - @repo/types contracts between API and Web

---

## Essential Reading by Task

| Task                  | Load These Guides                               |
| --------------------- | ----------------------------------------------- |
| API development       | API-OVERVIEW, API-MODULES, DATABASE             |
| Adding new API module | API-MODULES, API-SHARED, API-VALIDATION         |
| Database changes      | DATABASE, API-SHARED                            |
| Web UI / styling      | WEB-OVERVIEW, WEB-COMPONENTS, DESIGN-TOKENS     |
| Data fetching         | WEB-DATA-LAYER, WEB-STATE                       |

| API/Web integration   | SHARED-TYPES, WEB-DATA-LAYER                    |

---

## Key File Locations

```
apps/api/src/
├── app.ts                  # Express setup
├── server.ts               # Entry point
├── modules/{feature}/      # Feature modules
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── routes.ts
│   └── types/
└── shared/
    ├── middlewares/
    └── utils/

apps/web/src/
├── app/                    # Next.js pages
│   ├── (public)/
│   └── (private)/
└── shared/
    ├── actions/            # Server actions (by feature)
    ├── components/         # React components (by feature)
    │   └── shadcn-ui/      # Base UI components
    ├── hooks/              # React hooks
    │   └── data/           # React Query hooks
    ├── schemas/             # Zod schemas (by feature)
    ├── states/              # Zustand stores
    ├── providers/          # Context providers
    ├── contexts/            # React contexts
    └── utils/               # Utility functions

packages/types/src/Contracts/  # Shared API types

---

## Regras para Todoist

- **Idioma**: Todas as tasks devem ser criadas em português.
- **Seções**: O projeto possui 3 seções — "feat" (novas funcionalidades), "refactor" (refatorações e melhorias) e "fix" (correções de bugs). Adicione cada task na seção correspondente ao tipo de mudança.
- **IDs Únicos**: Usar padrão `[vyn-XXX]` onde XXX é um número crescente e nunca repete.
- **Contador**: O arquivo `.opencode/task-counter.json` armazena o último número usado.
- **Fluxo ao criar**: Ler o JSON, incrementar `last`, criar task com prefixo `[vyn-XXX]`, atualizar o JSON.
```

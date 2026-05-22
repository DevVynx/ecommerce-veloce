## Agentic Coding Guidelines for E-commerce BeliBeli

**IMPORTANT: Read this entire file before starting any task.**

**ALWAYS read `@docs/project/STATE.md` first** to check the current project state, active task, and recent decisions. Update the state file if the task context changes.

---

## Project Overview

This is a TypeScript monorepo (pnpm workspace + Turbo) containing:

- **apps/api**: Express.js REST API with Prisma ORM and PostgreSQL
- **apps/web**: Next.js 16 (App Router) frontend
- **packages/**: Shared configs and types (@repo/types)

**Stack**: TypeScript, Express, Next.js 16, Prisma, PostgreSQL, Zustand, Tailwind CSS

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
- User asks to add a new data fetching endpoint → Load WEB-DATA-LAYER.md

### How to Load Guides

When you see a reference like `@docs/guides/API-OVERVIEW.md` or need information from a specific topic, use the Read tool:

```
Read tool → filePath: "C:\Code\Projetos-FullStack\ecommerce-belibeli\docs\guides\API-OVERVIEW.md"
```

### Recursive Loading

If a loaded guide references another guide for deeper details, load that guide too.

---

## CRITICAL: Always Ask Before Making Decisions

**STOP AND WAIT** — Never execute actions automatically, always confirm first.

### When to ALWAYS Ask

If at any point you need to do something that was not explicitly requested, **STOP and ASK**:

- Adding files to a commit that were not mentioned
- Modifying code that was not in the scope of the request
- Performing git operations (reset, stash, commit) without explicit confirmation
- Changing commit descriptions beyond what was requested
- Reverting code before confirming the scope

### What NOT to Do (Examples)

- ❌ User asks "adjust commit" → You add more files without asking which ones
- ❌ User asks "go back" → You modify code while doing the reset
- ❌ User asks something → You answer without verifying you understood correctly

### What TO Do (Examples)

- ✅ "Can I include file X in the commit as well?"
- ✅ "Do you want me to revert only file Y or all of them?"
- ✅ "Did I understand correctly that you want to do X with Y?"

### Golden Rule

> Better to ask 10 times than to make 1 wrong change.

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

## Code Quality Principles

Quality is always more important than delivery speed. These principles **MUST** be followed in every task.

### Net Positive Over Perfection
- Prioritize code quality, but do not block progress on minor imperfections
- A net improvement is better than perfect code that never ships
- Every commit should leave the codebase cleaner than you found it

### Grounded in Principles, Not Opinions
- Base every decision on established engineering principles (SOLID, DRY, KISS, YAGNI)
- If you are unsure about something, **ASK** — do not rely on assumptions or gut feelings
- Every architecture decision must have a clear rationale

### Security is Non-Negotiable
- Validate all inputs with Zod on both API and Web
- Authenticate and authorize all protected resources
- Never hardcode secrets, credentials, or tokens
- Never expose sensitive data in logs, error messages, or API responses

### Maintainability First
- Code is read far more often than it is written — prioritize clarity over cleverness
- Names must reveal intent; single responsibility per function/module
- Comments explain **"why"** (trade-offs, decisions), not **"what"** (mechanics)
- Minimal nesting depth; favor early returns and guard clauses

### TypeScript Strictness
- **No `any`** — use `unknown` and narrow appropriately
- **Strict Mode** — always follow TypeScript strict mode rules
- **`type` over `interface`** — prefer `type` for object shapes, except when interface is required

### Testing & Robustness
- Cover failure modes, edge cases, and error paths — not just happy paths
- Prefer meaningful tests that validate behavior, not implementation details

### Patterns
- **API**: Follow the module/controller/service/repository pattern
- **Web**: Use Next.js Server Actions for data fetching and mutations
- **Error Handling**: Use HttpError classes on API, proper error states on Web

For detailed patterns, see the guides in @docs/guides/. For code reviews, use the `@pragmatic-code-review` skill.

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
- **@docs/guides/WEB-DATA-LAYER.md** - Server Actions, data fetching patterns
- **@docs/guides/WEB-STATE.md** - Zustand stores, when to use vs Server Actions
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
    │   └── data/           # Data hooks (server actions, mutations)
    ├── schemas/             # Zod schemas (by feature)
    ├── states/              # Zustand stores
    ├── providers/          # Context providers
    ├── contexts/            # React contexts
    └── utils/               # Utility functions

packages/types/src/Contracts/  # Shared API types

---

## Todoist Rules

- **Language**: All tasks must be created in Portuguese.
- **Sections**: The project has 3 sections — "feat" (new features), "refactor" (refactoring and improvements) and "fix" (bug fixes). Add each task to the corresponding section based on change type.
- **Unique IDs**: Use the pattern `[vyn-XXX]` where XXX is an incrementing number that never repeats.
- **Counter**: The file `.opencode/task-counter.json` stores the last used number.
- **Creation flow**: Read the JSON, increment `last`, create task with prefix `[vyn-XXX]`, update the JSON.
```

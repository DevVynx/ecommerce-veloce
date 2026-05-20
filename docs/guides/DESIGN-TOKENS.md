# Design Tokens - Guia de Cores (shadcn/ui)

## Índice

1. [Estrutura Geral](#1-estrutura-geral)
2. [Tokens por Contexto](#2-tokens-por-contexto)
3. [Árvore de Decisão](#3-árvore-de-decisão)
4. [Regras Gerais](#4-regras-gerais)
5. [Exemplos Práticos](#5-exemplos-práticos)

---

## 1. Estrutura Geral

O design system usa tokens CSS custom properties definidos no `globals.css`. Cada token tem um par `bg-*` / `text-*` que garante contraste tanto no tema claro quanto no escuro.

```css
/* Exemplo de definição no :root e .dark */
:root {
  --background: oklch(0.99 0 0);
  --foreground: oklch(0 0 0);
  --primary: oklch(0 0 0);
  --primary-foreground: oklch(1 0 0);
  /* ... */
}
```

Uso no Tailwind: `bg-background`, `text-foreground`, `bg-primary`, `text-primary-foreground`, etc.

---

## 2. Tokens por Contexto

### 2.1 Fundação da Página

| Token | Uso | Regra |
|---|---|---|
| `bg-background` | Fundo principal da aplicação | Base de toda interface, aplicado no `body` |
| `text-foreground` | Cor padrão do texto | Texto primário de parágrafos, headings, labels |

### 2.2 Containers e Caixas

| Token | Uso | Exemplo | Regra |
|---|---|---|---|
| `bg-card` / `text-card-foreground` | Cards, painéis, containers flutuando sobre o fundo | Card de produto, dashboard card, modal container | Usar quando um elemento precisa se destacar do fundo principal |
| `bg-popover` / `text-popover-foreground` | Elementos que aparecem "por cima" da interface | Dropdowns, tooltips, select menus, modais | Sempre que um elemento sobrepõe temporariamente o conteúdo |

### 2.3 Ações e Botões

| Token | Uso | Exemplo | Regra |
|---|---|---|---|
| `bg-primary` / `text-primary-foreground` | Botão principal de ação (CTA) | "Entrar", "Finalizar Compra", "Salvar" | Apenas UM por tela como ação mais importante |
| `bg-secondary` / `text-secondary-foreground` | Botões alternativos | "Cancelar", "Voltar" | Ação secundária ao lado do botão primário |
| `bg-destructive` / `text-destructive-foreground` | Ações perigosas ou irreversíveis | "Excluir Conta", "Remover do Carrinho" | Reservado para estados críticos e mensagens de erro |

### 2.4 Elementos Sutis

| Token | Uso | Regra |
|---|---|---|
| `bg-muted` | Fundos discretos, abas inativas, áreas de destaque suave | Reduz hierarquia visual do container |
| `text-muted-foreground` | Textos secundários, placeholders, legendas, ícones de apoio | Reduz hierarquia visual do conteúdo |
| `bg-accent` | Hover states, interação do usuário em menus e listas | Feedback visual de interação |
| `text-accent-foreground` | Texto em elementos com background accent | Contraste sobre bg-accent |

### 2.5 Estrutura e Formulários

| Token | Uso | Exemplo |
|---|---|---|
| `border-border` | Borda padrão do sistema | Separadores, divisões de layout, bordas de containers |
| `border-input` | Bordas específicas de inputs e formulários | input, textarea, select |
| `ring-ring` | Estado de foco (focus ring) | Quando um input recebe foco |

### 2.6 Tokens Específicos

| Token | Uso | Regra |
|---|---|---|
| `sidebar-*` | Cores exclusivas do Sidebar/Menu lateral | Separados para não conflitar com o conteúdo principal |
| `chart-*` (chart-1 a chart-5) | Cores reservadas para gráficos | Dashboards, analytics, gráficos administrativos |

---

## 3. Árvore de Decisão

```
Qual cor usar?

1. É fundo da página?
   ├── Sim → bg-background
   └── Não ↓

2. É um container/caixa?
   ├── É card flutuando sobre o fundo? → bg-card
   ├── É popover/dropdown/tooltip? → bg-popover
   └── Não ↓

3. É um botão?
   ├── É a ação principal da tela? → bg-primary
   ├── É ação secundária/alternativa? → bg-secondary
   ├── É ação destrutiva (excluir/remover)? → bg-destructive
   └── Não ↓

4. É um elemento sutil/de apoio?
   ├── Precisa de fundo discreto? → bg-muted
   ├── É texto secundário/placeholder/legenda? → text-muted-foreground
   ├── É hover state? → bg-accent
   └── Não ↓

5. É estrutura/borda?
   ├── Borda genérica? → border-border
   ├── Borda de input? → border-input
   ├── Focus ring? → ring-ring
   └── Não ↓

6. É algo específico?
   ├── Sidebar? → sidebar-*
   ├── Gráfico? → chart-*
   └── Caso contrário → repense o design
```

---

## 4. Regras Gerais

1. **Semântica sobre estética** — Sempre respeitar a semântica do token, não apenas a aparência visual. Não usar cor "porque ficou bonita"; usar o token correto para o contexto correto.

2. **Consistência entre temas** — O sistema deve funcionar igualmente bem em tema claro e escuro. Nunca usar cores hardcoded (hex/rgb fixo) quando existir um token equivalente.

3. **Hierarquia visual** — Usar `muted` para reduzir importância visual, `primary` para destacar, `foreground` para o padrão.

4. **Ações destrutivas** — `destructive` é exclusivo para ações irreversíveis ou perigosas. Não usar para feedback positivo ou ações comuns.

5. **Card vs Popover** — `card` é para containers persistentes na página; `popover` é para elementos temporários que sobrepõem o conteúdo.

6. **Acento verde em promoções** — Para destacar valores promocionais (descontos, frete grátis, sale prices), usar `text-green-600` / `bg-green-500` como cor de destaque pontual. Este é um dos poucos casos onde uma cor utilitária do Tailwind é aceitável, desde que usada **apenas** para o elemento promocional em si, não para containers ou fundos amplos.

---

## 5. Exemplos Práticos

```tsx
// ❌ Ruim - cor hardcoded sem contexto
<div className="bg-[#f5f5f5] text-[#333]">
  <p>Conteúdo</p>
</div>

// ✅ Bom - tokens semânticos
<div className="bg-card text-card-foreground">
  <p>Conteúdo</p>
</div>
```

```tsx
// ❌ Ruim - primary usado onde não é ação principal
<button className="bg-primary">Cancelar</button>

// ✅ Bom - secondary para ação secundária
<button className="bg-secondary">Cancelar</button>
<button className="bg-primary">Salvar</button>
```

```tsx
// ❌ Ruim - muted no lugar errado
<p className="text-muted-foreground">Total: R$ 100,00</p> {/* Total é info importante */}

// ✅ Bom - muted só para textos secundários
<p className="text-muted-foreground">Prazo de entrega: 5 dias úteis</p>
<p className="text-foreground font-bold">Total: R$ 100,00</p>
```

```tsx
// ❌ Ruim - destructive para ação de remover item comum
<button className="bg-destructive">Remover do carrinho</button>

// ✅ Bom - destructive exclusivo para ações realmente perigosas
<button className="bg-destructive">Excluir conta permanentemente</button>

// Remover item do carrinho é uma ação comum, não destrutiva
<button className="text-muted-foreground hover:text-destructive">
  Remover
</button>
```

```tsx
// ❌ Ruim - fundo chamativo para um bloco de apoio
<div className="bg-amber-50 p-3">...</div>

// ✅ Bom - fundo neutro com destaque apenas no elemento promocional
<div className="bg-muted p-3">
  <span className="text-green-600 font-bold">R$ 50,00</span> para frete grátis
</div>
```

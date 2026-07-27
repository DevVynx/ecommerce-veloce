# Melhorias Conhecidas Não Implementadas

Este documento registra funcionalidades e melhorias que seriam importantes em um ecommerce real, mas que não foram implementadas por decisão consciente — seja por escopo reduzido (projeto de estudo/demonstração), uso de ambientes de teste, ou trade-offs de tempo.

---

## Checkout & Pagamentos

### Estratégia de Estoque (Stock)

- **O que seria**: Validar estoque disponível antes de criar o pedido e decrementar ao confirmar pagamento (ou reservar no `createOrder` e liberar se expirar).
- **Por que não foi**: O projeto usa Stripe em modo de teste — não há risco real de oversell. A decisão de reservar vs validar no `confirmPayment` foi adiada e exigiria análise de concorrência e deadlock.

### PIX e Boleto

- **O que seria**: Oferecer PIX e boleto como opções de pagamento, com webhooks de confirmação assíncrona.
- **Por que não foi**: O Stripe está configurado em test mode. PIX exigiria ativação na conta Stripe e envolveria dinheiro real em um projeto de portfolio. O seletor de pagamento foi simplificado para exibir apenas cartão.

### Webhook do Stripe sem Retry

- **O que seria**: Mecanismo de retry com fila (bull/bullmq) para reprocessar webhooks falhos, idempotência, e logging de eventos rejeitados.
- **Por que não foi**: Em test mode o volume de eventos é baixo e não há risco financeiro. Um sistema real precisaria de fila + dashboard de monitoramento.

---

## Infraestrutura & Operação

### Cache

- **O que seria**: Cache de produtos, categorias e consultas frequentes com Redis ou similar para reduzir carga no banco.
- **Por que não foi**: Sem necessidade para volume de teste. Um ecommerce real precisaria de cache distribuído e invalidação por evento.

### Logging Estruturado

- **O que seria**: Logger estruturado (pino/winston) com níveis, correlação de requisições e transporte para agregador (Datadog/Grafana).
- **Por que não foi**: Apenas `console.log` é usado. Suficiente para desenvolvimento, mas inviável em produção.

### Testes Automatizados

- **O que seria**: Testes unitários (services, helpers), integração (repositories, controllers) e e2e (fluxo completo de checkout).
- **Por que não foi**: Zero testes no repositório. Não havia requisito de cobertura para este projeto.

---

## Integrações

### Frete com Transportadora Real

- **O que seria**: Integração com APIs reais (Correios, Jadlog, etc.) para cotação e geração de etiqueta.
- **Por que não foi**: O cálculo de frete é simulado localmente (PAC/SEDEX) a partir do CEP. Não há chamada a APIs externas de transportadora.

### Wishlist com Notificações

- **O que seria**: Notificar usuário quando um item da wishlist entrar em promoção ou baixar de estoque.
- **Por que não foi**: A wishlist implementa CRUD básico sem notificações ou tracking de preço.

---

## Nota

Esta lista não é exaustiva. Cada item foi avaliado e deixado de lado intencionalmente para manter o escopo do projeto compatível com seu propósito de estudo e demonstração. Em um cenário real de produção, todos os itens acima seriam priorizados conforme o impacto no negócio.

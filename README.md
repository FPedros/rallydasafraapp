# Rally da Safra

Base web para gestao operacional do Rally com frontend React/Vite/TypeScript/Tailwind e backend Node.js/Express.

## Estrutura

- `frontend/`: interface mobile first, layout responsivo, contexto de ano + edicao e telas operacionais.
- `backend/`: API REST com CRUD em memoria, organizacao por modulos e dados mockados iniciais.

## Requisitos

- Node.js 20+
- npm 10+

## Como rodar

### Backend

```bash
cd backend
npm install
npm run dev
```

API disponivel em `http://localhost:4000/api`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplicacao disponivel em `http://localhost:5173`.

Se quiser apontar para outra URL da API, configure `VITE_API_URL`.

## Fluxo principal

1. Abra a tela inicial.
2. Selecione o ano do Rally.
3. Selecione a edicao desejada.
4. Navegue pelo dashboard e modulos operacionais da edicao ativa.

## Funcionalidades entregues

- Selecao obrigatoria de ano e edicao antes do acesso aos dados operacionais.
- Dashboard contextualizado.
- CRUD para carros, equipes, pessoas, rotas, hoteis, abastecimentos, manutencoes, alimentacao e alertas.
- Detalhe de carro com historico de abastecimento e manutencao.
- Detalhe de equipe com pessoas, responsavel destacado e consolidado de alimentacao.
- Utilitario de limite de alimentacao com estados `normal`, `warning` e `exceeded`.
- Layout responsivo com sidebar no desktop e bottom navigation no mobile.

## Observacoes

- O backend usa dados em memoria para facilitar evolucao futura para banco real.
- A API ja esta preparada para filtros por `editionId`, `teamId`, `carId`, `routeId`, `personId`, `from`, `to` e busca textual.

## Deploy no Vercel

Este repositorio tem `frontend` e `backend`, entao o caminho mais simples no Vercel e criar 2 projetos separados:

### 1. Frontend

- Crie um projeto novo no Vercel.
- Selecione este repositorio.
- Defina `Root Directory` como `frontend`.
- O framework sera detectado como `Vite`.
- Em producao, se quiser apontar para um backend externo, configure `VITE_API_URL`.

### 2. Backend

- Crie outro projeto no Vercel.
- Selecione o mesmo repositorio.
- Defina `Root Directory` como `backend`.
- Se necessario, use a URL publicada desse projeto como valor de `VITE_API_URL` no frontend.

Se voce tentar subir a raiz `./` como um unico projeto, o Vercel passa a tratar o repositorio como multi-servico e pode exigir configuracao adicional via `vercel.json`.
# rallydasafraapp

# Agriculture Test

Monorepo contendo um backend em [NestJS](https://nestjs.com) e um frontend em [Next.js](https://nextjs.org).  
O objetivo do projeto é construir uma aplicação web para monitoramento de talhões agrícolas, permitindo que produtores cadastrem áreas, consultem indicadores e gerenciem atividades do campo.

## Funcionalidades

- Autenticação JWT (registro e login)
- CRUD completo de Talhões (Fields)
- CRUD de Atividades vinculadas a Talhões
- Frontend com Next.js consumindo a API
- Responsividade (desktop e mobile)
- CI/CD com GitHub Actions
- Documentação da API no Postman

## Requisitos

- [Node.js](https://nodejs.org) >= 20
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) (opcional, mas recomendado)

## Instalação

```bash
pnpm install
```

## Variáveis de ambiente

### Backend (apps/backend)

- Crie um arquivo .env baseado no arquivo .env.example:
  cp apps/backend/.env.example apps/backend/.env
- Preencha as variáveis:

```
DATABASE_URL=postgresql://agro_user:agro_password@localhost:5432/agro_db?schema=public
JWT_SECRET=sua_chave
PORT=3000
```

- `DATABASE_URL:` string de conexão do PostgreSQL.
- `JWT_SECRET:` chave usada para assinar os tokens JWT.
- `PORT:` porta em que o backend irá escutar.

### Frontend (apps/frontend)

- Crie um arquivo .env.local com a URL do backend acessível pelo browser:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

A variável `NEXT_PUBLIC_API_URL` é exposta ao navegador e define a base das requisições ao backend.

## Endpoints Principais

- `POST /auth/register` – cadastro de usuário
- `POST /auth/login` – autenticação
- `GET /fields` – listar talhões do usuário logado
- `POST /fields` – criar talhão
- `GET /fields/:id` – detalhes de um talhão
- `POST /fields/:id/activities` – registrar atividade
- `GET /fields/:id/activities` – listar atividades

## Telas do Frontend

- Login / Cadastro
- Dashboard → listagem dos talhões cadastrados
- Cadastro de Talhão → formulário (nome, cultura, área em hectares, localização lat/long)
- Detalhe do Talhão → informações gerais + lista de atividades

## Executando com Docker

O projeto inclui um `docker-compose.yaml` que sobe banco de dados, backend e frontend:

```
docker compose up --build
```

- Backend: http://localhost:3000
- Frontend: http://localhost:3001
- Banco de dados (PostgreSQL): porta 5432

## Executando manualmente

- Garanta que um PostgreSQL esteja em execução e que a variável DATABASE_URL aponte para ele.
- Aplique as migrações do Prisma:
- pnpm --filter backend prisma:mig
- Inicie o backend:

```
pnpm --filter backend start:dev
```

- Inicie o frontend em outro terminal:

```
pnpm --filter frontend dev
```

## Scripts úteis

- `pnpm lint:check` – executa check com Prettier e ESLint.
- `pnpm lint:fix` – executa fix com Prettier e ESLint.
- `pnpm --filter backend test` – executa os testes do backend.

### Backend (apps/backend)

- `pnpm test` - executa bateria de testes unitários (autenticação + CRUD de talhões)

## Testes

O backend possui testes automatizados (mínimo autenticação e CRUD de talhões) escritos em Jest + Supertest.

`pnpm --filter backend test`

## Documentação da API

A API está documentada em uma coleção Postman incluída no repositório:
`docs/backend/agriculture.postman_collection.json`

## CI/CD

Este repositório utiliza GitHub Actions para rodar build e testes automaticamente em cada PR.
O workflow está localizado em `.github/workflows/ci.yml`.

## Estrutura

apps/
backend/ # API NestJS
frontend/ # Aplicação Next.js
docs/ # Documentação Postman e materiais auxiliares

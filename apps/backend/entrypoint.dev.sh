#!/usr/bin/env bash
set -e 

echo "⏳ Aguardando o banco de dados (database:5432)..."
until nc -z database 5432; do
  sleep 1
done
echo "✅ Banco disponível!"

pnpm prisma generate

pnpm prisma migrate dev --name init || true

if [ "$RUN_SEED" = "true" ]; then
  echo "🌱 Executando seed..."
  pnpm seed || true
fi

echo "🚀 Iniciando servidor Nest..."
pnpm start:dev
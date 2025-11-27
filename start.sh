#!/bin/sh
set -e

echo "🔍 Verificando variáveis de ambiente..."

if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERRO: DATABASE_URL não configurada!"
  exit 1
fi

if [ -z "$JWT_SECRET" ]; then
  echo "⚠️  AVISO: JWT_SECRET não configurada! Usando valor padrão (INSEGURO)"
fi

echo "📦 Gerando Prisma Client..."
npx prisma generate

echo "🔄 Executando migrations..."
npx prisma migrate deploy

echo "🌱 Executando seed (se existir)..."
npm run prisma:seed || echo "Sem seed configurado, continuando..."

echo "🚀 Iniciando servidor..."
node dist/main

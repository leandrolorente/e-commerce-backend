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
npx prisma generate --schema=./prisma/schema.prisma

echo "🔄 Executando migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma

echo "🚀 Iniciando servidor..."
# Try both possible locations for main.js
if [ -f "dist/src/main.js" ]; then
  node dist/src/main
elif [ -f "dist/main.js" ]; then
  node dist/main
else
  echo "ERROR: Não encontrei main.js!"
  ls -la dist/
  exit 1
fi

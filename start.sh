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
node dist/main

# 🚀 Comandos Rápidos - GuaranaTattoShop Backend

## Iniciar Projeto (Primeira Vez)

```powershell
# 1. Instalar dependências
npm install

# 2. Gerar Prisma Client
npm run prisma:generate

# 3. Criar database
npm run prisma:migrate

# 4. Popular com dados
npm run prisma:seed

# 5. Rodar backend
npm run start:dev
```

## Comandos Diários

```powershell
# Rodar backend em desenvolvimento
npm run start:dev

# Ver database visualmente
npm run prisma:studio

# Criar nova migration (após alterar schema.prisma)
npm run prisma:migrate
```

## Testar API

```powershell
# Login Admin
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@guaranatatto.com\",\"password\":\"admin123\"}"

# Listar produtos
curl http://localhost:3000/api/products

# Listar tatuagens
curl http://localhost:3000/api/tattoos
```

## Troubleshooting

```powershell
# Prisma com erro? Regenerar client
npm run prisma:generate

# Database não conecta? Verificar .env
cat .env

# Resetar database
npm run prisma:migrate -- reset
npm run prisma:seed
```

## 🎯 URLs Importantes

- Backend: http://localhost:3000/api
- Prisma Studio: http://localhost:5555
- Documentação: Ver SETUP_COMPLETO.md

## 📌 Credenciais Padrão

```
Admin: admin@guaranatatto.com / admin123
User:  user@test.com / user123
```

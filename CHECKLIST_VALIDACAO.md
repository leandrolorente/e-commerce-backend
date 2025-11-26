# ✅ Checklist de Validação - Backend

Use este checklist para garantir que tudo está funcionando corretamente.

## 📦 Instalação

```powershell
# 1. Instalar dependências
npm install

# 2. Gerar Prisma Client
npm run prisma:generate

# 3. Criar database
npm run prisma:migrate

# 4. Popular com dados
npm run prisma:seed

# 5. Iniciar servidor
npm run start:dev
```

## ✅ Validações

### 1. Servidor Rodando
- [ ] Servidor iniciou sem erros
- [ ] Console mostra: `🚀 Backend rodando em http://localhost:3000/api`
- [ ] Porta 3000 está livre

### 2. Database Conectado
- [ ] Prisma Client gerado sem erros
- [ ] Migration executada com sucesso
- [ ] Seed populou o database
- [ ] Prisma Studio abre: `npm run prisma:studio`

### 3. Autenticação
```powershell
# Login Admin
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@guaranatatto.com\",\"password\":\"admin123\"}"
```
- [ ] Retorna `access_token`
- [ ] Retorna dados do usuário
- [ ] Token é válido

### 4. Produtos
```powershell
# Listar produtos
curl http://localhost:3000/api/products
```
- [ ] Retorna array de produtos
- [ ] Produtos do seed aparecem
- [ ] Imagens URL presentes

### 5. Tatuagens
```powershell
# Listar tatuagens
curl http://localhost:3000/api/tattoos
```
- [ ] Retorna array de tatuagens
- [ ] 5 tatuagens do seed aparecem
- [ ] Campos style, bodyArea presentes

### 6. Endpoints Protegidos

Primeiro faça login e pegue o token, depois:

```powershell
# Criar produto (precisa token ADMIN)
curl -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -H "Authorization: Bearer SEU_TOKEN" -d "{\"name\":\"Teste\",\"description\":\"Produto teste\",\"price\":100,\"stock\":10,\"category\":\"AFTERCARE\"}"
```
- [ ] Com token ADMIN: Cria produto
- [ ] Sem token: Retorna 401
- [ ] Com token USER: Retorna 403

### 7. CORS
- [ ] Frontend pode fazer requisições
- [ ] CORS_ORIGIN configurado no .env
- [ ] Preflight OPTIONS funciona

### 8. Validação
```powershell
# Registro com email inválido
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d "{\"email\":\"invalido\",\"password\":\"123\",\"name\":\"Teste\"}"
```
- [ ] Retorna erro de validação
- [ ] ValidationPipe funcionando

### 9. Arquivos Criados
- [ ] `.env` existe e está preenchido
- [ ] `.env.example` existe
- [ ] `prisma/schema.prisma` completo
- [ ] `prisma/seed.ts` existe
- [ ] Todos os módulos em `src/` criados
- [ ] README.md atualizado

### 10. Git
```powershell
# Verificar .gitignore
cat .gitignore
```
- [ ] `.env` no gitignore
- [ ] `node_modules` no gitignore
- [ ] `/dist` no gitignore

## 🔍 Testes Finais

### Criar Usuário Novo
```json
POST /api/auth/register
{
  "email": "novo@test.com",
  "password": "senha123",
  "name": "Novo Usuario",
  "phone": "11999999999"
}
```
- [ ] Usuário criado
- [ ] Senha hasheada
- [ ] Token retornado

### Criar Agendamento
```json
POST /api/bookings
Headers: Authorization: Bearer {token}
{
  "artistId": "1",
  "service": "NOVA_TATUAGEM",
  "date": "2025-12-01",
  "time": "14:00"
}
```
- [ ] Agendamento criado
- [ ] Retorna dados do artista

### Criar Pedido
```json
POST /api/orders
Headers: Authorization: Bearer {token}
{
  "items": [
    {
      "productId": "{id-produto}",
      "quantity": 2,
      "price": 45.90
    }
  ],
  "shippingAddress": "Rua Teste, 123"
}
```
- [ ] Pedido criado
- [ ] Total calculado
- [ ] OrderItems criados

## 🎯 Critérios de Sucesso

✅ **TUDO FUNCIONANDO** se:
- Todos os checkboxes acima estão marcados
- Servidor roda sem erros
- Database conectado
- Todos os endpoints respondem
- Autenticação funciona
- Guards protegem rotas

## ❌ Problemas Comuns

### Erro Prisma Client
```powershell
npm run prisma:generate
```

### Database não conecta
- Verificar DATABASE_URL no .env
- PostgreSQL rodando?

### CORS bloqueado
- Adicionar URL no CORS_ORIGIN (.env)

### Token inválido
- JWT_SECRET correto no .env?

## 📊 Status Final

- [ ] ✅ Backend 100% funcional
- [ ] ✅ Pronto para integração com Angular
- [ ] ✅ Pronto para deploy

---

**Se todos os itens estão marcados: PARABÉNS! 🎉**

Backend completo e validado!

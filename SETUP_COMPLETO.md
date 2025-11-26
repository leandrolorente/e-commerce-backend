# 🚀 Backend GuaranaTattoShop - Setup Completo

Backend NestJS criado com sucesso! Todos os módulos foram implementados seguindo as melhores práticas.

## 📦 Estrutura Criada

```
src/
├── auth/                # ✅ Autenticação JWT completa
│   ├── dto/            # LoginDto, RegisterDto
│   ├── guards/         # JwtAuthGuard, RolesGuard
│   └── strategies/     # JwtStrategy
├── prisma/             # ✅ ORM Database
├── products/           # ✅ CRUD Produtos
├── tattoos/            # ✅ CRUD Tatuagens
├── bookings/           # ✅ Agendamentos
├── orders/             # ✅ Pedidos com OrderItems
├── payments/           # ✅ MercadoPago + Webhooks
├── upload/             # ✅ Cloudinary Upload
├── email/              # ✅ SendGrid Email
└── common/             # ✅ Decorators, Guards
```

## 🔧 Próximos Passos

### 1️⃣ Instalar Dependências Faltantes (se necessário)

```powershell
npm install
```

### 2️⃣ Configurar Variáveis de Ambiente

Edite o arquivo `.env` e preencha com suas credenciais:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/guaranatatto?schema=public"
JWT_SECRET="sua-chave-secreta-aqui"
CLOUDINARY_CLOUD_NAME="seu-cloud-name"
# ... etc
```

### 3️⃣ Gerar Prisma Client e Criar Database

```powershell
# Gerar cliente Prisma
npm run prisma:generate

# Criar migration inicial
npm run prisma:migrate

# Popular banco com dados de teste
npm run prisma:seed
```

### 4️⃣ Rodar o Backend

```powershell
npm run start:dev
```

O backend estará disponível em: **http://localhost:3000/api**

## 🎯 Endpoints Disponíveis

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Perfil (protegido)

### Produtos
- `GET /api/products` - Listar produtos
- `GET /api/products/:id` - Detalhes do produto
- `POST /api/products` - Criar produto (ADMIN)
- `PATCH /api/products/:id` - Atualizar produto (ADMIN)
- `DELETE /api/products/:id` - Deletar produto (ADMIN)

### Tatuagens
- `GET /api/tattoos` - Listar tatuagens
- `GET /api/tattoos/:id` - Detalhes da tatuagem
- `POST /api/tattoos` - Criar tatuagem (ADMIN)
- `PATCH /api/tattoos/:id` - Atualizar tatuagem (ADMIN)
- `DELETE /api/tattoos/:id` - Deletar tatuagem (ADMIN)

### Agendamentos
- `POST /api/bookings` - Criar agendamento (protegido)
- `GET /api/bookings` - Listar agendamentos (protegido)
- `GET /api/bookings/:id` - Detalhes do agendamento
- `PATCH /api/bookings/:id` - Atualizar status (ADMIN)
- `DELETE /api/bookings/:id` - Cancelar agendamento

### Pedidos
- `POST /api/orders` - Criar pedido (protegido)
- `GET /api/orders` - Listar pedidos (protegido)
- `GET /api/orders/:id` - Detalhes do pedido

### Pagamentos
- `POST /api/payments/:orderId` - Criar pagamento (protegido)
- `POST /api/payments/webhook` - Webhook MercadoPago

### Upload
- `POST /api/upload/image` - Upload de imagem (protegido)

## 👤 Credenciais de Teste (após seed)

```
Admin: admin@guaranatatto.com / admin123
User:  user@test.com / user123
```

## 🔍 Verificar Erros

Após gerar o Prisma Client, os erros TypeScript do Prisma devem desaparecer.

```powershell
npm run prisma:generate
```

## 📊 Visualizar Database

```powershell
npm run prisma:studio
```

Abre interface visual em: http://localhost:5555

## 🧪 Testar Endpoints

Use Postman, Thunder Client ou curl:

```powershell
# Registrar usuário
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{
  "email": "teste@email.com",
  "password": "senha123",
  "name": "Teste User",
  "phone": "11999999999"
}'

# Login
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{
  "email": "admin@guaranatatto.com",
  "password": "admin123"
}'

# Listar produtos (público)
curl http://localhost:3000/api/products
```

## 🚀 Deploy Railway

1. Commitar código:
```powershell
git add .
git commit -m "Backend completo GuaranaTattoShop"
git push
```

2. No Railway:
   - Conectar repositório
   - Adicionar PostgreSQL
   - Configurar variáveis de ambiente
   - Deploy automático!

## ✅ Checklist

- [x] Prisma Schema com todos os models
- [x] PrismaService e PrismaModule
- [x] Autenticação JWT completa
- [x] Guards e Decorators
- [x] Products Module (CRUD)
- [x] Tattoos Module (CRUD)
- [x] Bookings Module
- [x] Orders Module
- [x] Payments Module (MercadoPago)
- [x] Upload Module (Cloudinary)
- [x] Email Module (SendGrid)
- [x] CORS configurado
- [x] Validation global
- [x] Seed de dados
- [x] AppModule atualizado

## 🆘 Problemas Comuns

### Erros do Prisma
```powershell
npm run prisma:generate
```

### Database não conecta
Verifique `DATABASE_URL` no `.env`

### CORS bloqueado
Adicione sua URL no `.env` → `CORS_ORIGIN`

## 🎉 Pronto!

Seu backend está completo e pronto para integração com o Angular!

---

**Desenvolvido com ❤️ usando NestJS + Prisma + PostgreSQL**

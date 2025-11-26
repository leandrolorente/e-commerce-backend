# 📚 API Documentation - GuaranaTattoShop Backend

## 🔗 Base URL
```
http://localhost:3000/api
```

## 🔐 Autenticação

Todas as rotas protegidas requerem um token JWT no header:
```
Authorization: Bearer {token}
```

---

## 👤 AUTH - Autenticação

### Registro de Usuário
```http
POST /api/auth/register
```

**Body:**
```json
{
  "email": "usuario@email.com",
  "password": "senha123",
  "name": "Nome do Usuário",
  "phone": "(11) 99999-9999"
}
```

**Response (201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "usuario@email.com",
    "name": "Nome do Usuário",
    "role": "USER",
    "createdAt": "2025-11-26T00:00:00.000Z"
  }
}
```

### Login
```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "usuario@email.com",
    "name": "Nome do Usuário",
    "role": "USER"
  }
}
```

### Obter Perfil (Protegido)
```http
GET /api/auth/me
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "usuario@email.com",
  "name": "Nome do Usuário",
  "phone": "(11) 99999-9999",
  "role": "USER",
  "createdAt": "2025-11-26T00:00:00.000Z"
}
```

---

## 📦 PRODUCTS - Produtos

### Listar Produtos
```http
GET /api/products
```

**Query Params (opcionais):**
- `category` - Filtrar por categoria (AFTERCARE, EQUIPMENT, PIGMENT, ACCESSORY)
- `featured` - "true" para ordenar por mais recentes
- `limit` - Número de produtos a retornar (ex: 6 para homepage)

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "Pomada Cicatrizante",
    "description": "Pomada para cicatrização de tatuagens",
    "price": 45.90,
    "category": "AFTERCARE",
    "stock": 100,
    "imageUrl": "https://...",
    "createdAt": "2025-11-26T00:00:00.000Z"
  }
]
```

### Obter Produto por ID
```http
GET /api/products/:id
```

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Pomada Cicatrizante",
  "description": "Pomada para cicatrização de tatuagens",
  "price": 45.90,
  "category": "AFTERCARE",
  "stock": 100,
  "imageUrl": "https://...",
  "createdAt": "2025-11-26T00:00:00.000Z",
  "updatedAt": "2025-11-26T00:00:00.000Z"
}
```

### Criar Produto (Admin)
```http
POST /api/products
Authorization: Bearer {admin_token}
```

**Body:**
```json
{
  "name": "Nome do Produto",
  "description": "Descrição detalhada",
  "price": 99.90,
  "category": "EQUIPMENT",
  "stock": 50,
  "imageUrl": "https://..."
}
```

**Response (201):** Retorna o produto criado

### Atualizar Produto (Admin)
```http
PATCH /api/products/:id
Authorization: Bearer {admin_token}
```

**Body (todos campos opcionais):**
```json
{
  "name": "Novo Nome",
  "price": 89.90,
  "stock": 30
}
```

**Response (200):** Retorna o produto atualizado

### Deletar Produto (Admin - Soft Delete)
```http
DELETE /api/products/:id
Authorization: Bearer {admin_token}
```

**Response (200):** Produto marcado como deletado

---

## 🎨 TATTOOS - Portfólio de Tatuagens

### Listar Tatuagens
```http
GET /api/tattoos
```

**Query Params (opcionais):**
- `style` - Filtrar por estilo (TRADITIONAL, REALISTIC, TRIBAL, etc)
- `bodyArea` - Filtrar por área (ARM, LEG, BACK, CHEST, etc)
- `featured` - "true" para ordenar por mais recentes
- `limit` - Número de tatuagens a retornar (ex: 6 para homepage)

**Response (200):**
```json
[
  {
    "id": "uuid",
    "title": "Dragon Oriental",
    "description": "Tatuagem de dragão estilo oriental",
    "imageUrl": "https://...",
    "bodyArea": "BACK",
    "estimatedTime": 8,
    "artistId": "uuid",
    "artist": {
      "id": "uuid",
      "name": "João Silva",
      "specialty": "Oriental",
      "bio": "10 anos de experiência...",
      "instagram": "@joaosilva",
      "photoUrl": "https://..."
    },
    "createdAt": "2025-11-26T00:00:00.000Z"
  }
]
```

### Obter Tatuagem por ID
```http
GET /api/tattoos/:id
```

**Response (200):** Retorna tatuagem com detalhes completos do artista

### Criar Tatuagem (Admin)
```http
POST /api/tattoos
Authorization: Bearer {admin_token}
```

**Body:**
```json
{
  "title": "Título da Tatuagem",
  "description": "Descrição detalhada",
  "imageUrl": "https://...",
  "bodyArea": "ARM",
  "estimatedTime": 4,
  "artistId": "uuid"
}
```

**Response (201):** Retorna a tatuagem criada

### Atualizar Tatuagem (Admin)
```http
PATCH /api/tattoos/:id
Authorization: Bearer {admin_token}
```

**Response (200):** Retorna a tatuagem atualizada

### Deletar Tatuagem (Admin)
```http
DELETE /api/tattoos/:id
Authorization: Bearer {admin_token}
```

**Response (200):** Tatuagem deletada

---

## 📅 BOOKINGS - Agendamentos

### Listar Artistas (Público)
```http
GET /api/bookings/artists
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "João Silva",
    "specialty": "Oriental, Realismo",
    "bio": "10 anos de experiência em tatuagens orientais...",
    "instagram": "@joaosilva",
    "photoUrl": "https://...",
    "isActive": true,
    "createdAt": "2025-11-26T00:00:00.000Z"
  }
]
```

### Verificar Horários Disponíveis (Público)
```http
GET /api/bookings/available-slots?artistId={uuid}&date={YYYY-MM-DD}
```

**Query Params:**
- `artistId` (obrigatório) - ID do artista
- `date` (obrigatório) - Data no formato YYYY-MM-DD (ex: 2025-12-15)

**Response (200):**
```json
{
  "artistId": "uuid",
  "date": "2025-12-15",
  "availableSlots": [
    "09:00",
    "10:00",
    "11:00",
    "14:00",
    "15:00",
    "16:00"
  ],
  "bookedSlots": [
    "12:00",
    "13:00",
    "17:00"
  ]
}
```

**Nota:** Horários de trabalho: 9h às 18h

### Meus Agendamentos (Protegido)
```http
GET /api/bookings/my-bookings
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "artistId": "uuid",
    "tattooId": "uuid",
    "date": "2025-12-15T14:00:00.000Z",
    "status": "CONFIRMED",
    "notes": "Observações",
    "createdAt": "2025-11-26T00:00:00.000Z",
    "artist": {
      "name": "João Silva",
      "instagram": "@joaosilva"
    },
    "tattoo": {
      "title": "Dragon Oriental",
      "imageUrl": "https://..."
    }
  }
]
```

### Criar Agendamento (Protegido)
```http
POST /api/bookings
Authorization: Bearer {token}
```

**Body:**
```json
{
  "artistId": "uuid",
  "tattooId": "uuid",
  "date": "2025-12-15T14:00:00.000Z",
  "notes": "Observações do cliente"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "artistId": "uuid",
  "tattooId": "uuid",
  "date": "2025-12-15T14:00:00.000Z",
  "status": "PENDING",
  "notes": "Observações do cliente",
  "createdAt": "2025-11-26T00:00:00.000Z",
  "artist": {
    "name": "João Silva"
  },
  "tattoo": {
    "title": "Dragon Oriental"
  }
}
```

### Listar Agendamentos (Protegido)
```http
GET /api/bookings
Authorization: Bearer {token}
```

**Query Params (opcionais):**
- `status` - Filtrar por status (PENDING, CONFIRMED, COMPLETED, CANCELLED)

**Response (200):** Lista de agendamentos do usuário logado (ou todos se admin)

### Obter Agendamento por ID (Protegido)
```http
GET /api/bookings/:id
Authorization: Bearer {token}
```

**Response (200):** Detalhes completos do agendamento

### Atualizar Status do Agendamento (Admin)
```http
PATCH /api/bookings/:id
Authorization: Bearer {admin_token}
```

**Body:**
```json
{
  "status": "CONFIRMED"
}
```

**Response (200):** Agendamento atualizado

### Cancelar Agendamento (Protegido)
```http
DELETE /api/bookings/:id
Authorization: Bearer {token}
```

**Response (200):** Agendamento cancelado

---

## 🛒 ORDERS - Pedidos

### Criar Pedido (Protegido)
```http
POST /api/orders
Authorization: Bearer {token}
```

**Body:**
```json
{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2,
      "price": 45.90
    },
    {
      "productId": "uuid",
      "quantity": 1,
      "price": 120.00
    }
  ],
  "shippingAddress": "Rua Exemplo, 123 - São Paulo, SP - CEP 01234-567"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "status": "PENDING",
  "totalAmount": 211.80,
  "shippingAddress": "Rua Exemplo, 123...",
  "createdAt": "2025-11-26T00:00:00.000Z",
  "items": [
    {
      "id": "uuid",
      "productId": "uuid",
      "quantity": 2,
      "price": 45.90,
      "product": {
        "name": "Pomada Cicatrizante",
        "imageUrl": "https://..."
      }
    }
  ]
}
```

### Listar Pedidos (Protegido)
```http
GET /api/orders
Authorization: Bearer {token}
```

**Response (200):** Lista de pedidos do usuário (ou todos se admin)

### Obter Pedido por ID (Protegido)
```http
GET /api/orders/:id
Authorization: Bearer {token}
```

**Response (200):** Detalhes completos do pedido com itens e produtos

---

## 💳 PAYMENTS - Pagamentos (MercadoPago)

### Criar Pagamento (Protegido)
```http
POST /api/payments/:orderId
Authorization: Bearer {token}
```

**Body:**
```json
{
  "paymentMethod": "credit_card"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "orderId": "uuid",
  "mercadoPagoId": "mp_id_12345",
  "status": "PENDING",
  "amount": 211.80,
  "paymentUrl": "https://www.mercadopago.com.br/checkout/v1/payment/...",
  "createdAt": "2025-11-26T00:00:00.000Z"
}
```

### Webhook MercadoPago (Público)
```http
POST /api/payments/webhook
```

**Nota:** Esta rota é chamada automaticamente pelo MercadoPago quando há mudanças no status do pagamento. Não precisa ser implementada no frontend.

---

## 📤 UPLOAD - Upload de Imagens (Cloudinary)

### Upload de Imagem (Protegido)
```http
POST /api/upload/image
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body (form-data):**
- `file`: arquivo de imagem (JPG, PNG, etc)

**Response (200):**
```json
{
  "url": "https://res.cloudinary.com/your-cloud/image/upload/v123456789/image.jpg",
  "publicId": "image_abc123"
}
```

---

## 📋 Enums e Tipos

### UserRole
- `USER` - Usuário comum
- `ADMIN` - Administrador

### ProductCategory
- `AFTERCARE` - Cuidados pós-tatuagem
- `EQUIPMENT` - Equipamentos
- `PIGMENT` - Tintas e pigmentos
- `ACCESSORY` - Acessórios

### BodyArea
- `ARM` - Braço
- `LEG` - Perna
- `BACK` - Costas
- `CHEST` - Peito
- `SHOULDER` - Ombro
- `NECK` - Pescoço
- `HAND` - Mão
- `FOOT` - Pé
- `OTHER` - Outro

### OrderStatus
- `PENDING` - Pendente
- `PROCESSING` - Em processamento
- `SHIPPED` - Enviado
- `DELIVERED` - Entregue
- `CANCELLED` - Cancelado

### BookingStatus
- `PENDING` - Pendente
- `CONFIRMED` - Confirmado
- `COMPLETED` - Concluído
- `CANCELLED` - Cancelado

### PaymentStatus
- `PENDING` - Pendente
- `APPROVED` - Aprovado
- `REJECTED` - Rejeitado
- `CANCELLED` - Cancelado
- `REFUNDED` - Reembolsado

---

## 🔒 Permissões

### Rotas Públicas (sem autenticação)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/tattoos`
- `GET /api/tattoos/:id`
- `GET /api/bookings/artists`
- `GET /api/bookings/available-slots`
- `POST /api/payments/webhook`

### Rotas Protegidas (requer autenticação)
- `GET /api/auth/me`
- `GET /api/bookings/my-bookings`
- `POST /api/bookings`
- `GET /api/bookings`
- `GET /api/bookings/:id`
- `DELETE /api/bookings/:id`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`
- `POST /api/payments/:orderId`
- `POST /api/upload/image`

### Rotas Admin (requer role ADMIN)
- `POST /api/products`
- `PATCH /api/products/:id`
- `DELETE /api/products/:id`
- `POST /api/tattoos`
- `PATCH /api/tattoos/:id`
- `DELETE /api/tattoos/:id`
- `PATCH /api/bookings/:id`

---

## 👥 USER - Perfil do Usuário

### Obter Perfil
```http
GET /api/user/profile
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "usuario@email.com",
  "name": "Nome do Usuário",
  "phone": "(11) 99999-9999",
  "role": "USER",
  "createdAt": "2025-11-26T00:00:00.000Z",
  "updatedAt": "2025-11-26T00:00:00.000Z"
}
```

### Atualizar Perfil
```http
PUT /api/user/profile
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "Novo Nome",
  "phone": "(11) 88888-8888",
  "email": "novoemail@email.com"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "novoemail@email.com",
  "name": "Novo Nome",
  "phone": "(11) 88888-8888",
  "role": "USER",
  "updatedAt": "2025-11-26T01:00:00.000Z"
}
```

### Alterar Senha
```http
PUT /api/user/change-password
Authorization: Bearer {token}
```

**Body:**
```json
{
  "currentPassword": "senhaAtual123",
  "newPassword": "novaSenha123"
}
```

**Response (200):**
```json
{
  "message": "Senha alterada com sucesso"
}
```

**Errors:**
- `401` - Senha atual incorreta
- `404` - Usuário não encontrado

### Listar Endereços
```http
GET /api/user/addresses
Authorization: Bearer {token}
```

**Response (200):**
```json
[]
```

**Nota:** Funcionalidade de endereços será implementada quando a tabela Address for adicionada ao schema.

### Adicionar Endereço
```http
POST /api/user/addresses
Authorization: Bearer {token}
```

**Body:**
```json
{
  "street": "Rua Exemplo",
  "number": "123",
  "complement": "Apto 45",
  "neighborhood": "Centro",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01234-567",
  "isDefault": true
}
```

**Response (400):**
```json
{
  "message": "Funcionalidade de endereços será implementada em breve"
}
```

### Deletar Endereço
```http
DELETE /api/user/addresses/:id
Authorization: Bearer {token}
```

**Response (400):**
```json
{
  "message": "Funcionalidade de endereços será implementada em breve"
}
```

### Definir Endereço Padrão
```http
PUT /api/user/addresses/:id/set-default
Authorization: Bearer {token}
```

**Response (400):**
```json
{
  "message": "Funcionalidade de endereços será implementada em breve"
}
```

---

## 📊 STUDIO - Estatísticas do Estúdio

### Obter Estatísticas
```http
GET /api/studio/stats
```

**Response (200):**
```json
{
  "totalTattoos": 15,
  "totalProducts": 23,
  "totalArtists": 3,
  "totalBookings": 45
}
```

**Nota:** Endpoint público (não requer autenticação).

---

## ⭐ REVIEWS - Avaliações

### Listar Avaliações de um Produto
```http
GET /api/reviews/:productId
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "rating": 5,
    "comment": "Produto excelente!",
    "userId": "uuid",
    "productId": "uuid",
    "createdAt": "2025-11-26T00:00:00.000Z",
    "user": {
      "id": "uuid",
      "name": "João Silva"
    }
  }
]
```

### Listar Avaliações em Destaque
```http
GET /api/reviews?featured=true&limit=6
```

**Query Parameters:**
- `featured` (optional): "true" para ordenar por data
- `limit` (optional): Número de reviews a retornar

**Response (200):**
```json
[
  {
    "id": "uuid",
    "rating": 5,
    "comment": "Produto excelente!",
    "userId": "uuid",
    "productId": "uuid",
    "createdAt": "2025-11-26T00:00:00.000Z",
    "user": {
      "id": "uuid",
      "name": "João Silva"
    },
    "product": {
      "id": "uuid",
      "name": "Produto Teste"
    }
  }
]
```

**Nota:** Endpoints públicos (não requerem autenticação).

---

## 🔄 ORDERS - Pedidos (Atualizado)

Além dos endpoints documentados anteriormente, os seguintes foram adicionados:

### Meus Pedidos
```http
GET /api/orders/my-orders
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (optional): Filtrar por status (PENDING, PAID, SHIPPED, DELIVERED, CANCELLED)

**Response (200):**
```json
[
  {
    "id": "uuid",
    "total": 150.00,
    "status": "PAID",
    "userId": "uuid",
    "createdAt": "2025-11-26T00:00:00.000Z",
    "items": [
      {
        "id": "uuid",
        "quantity": 2,
        "price": 75.00,
        "product": {
          "name": "Produto Teste"
        }
      }
    ]
  }
]
```

### Estatísticas de Pedidos (Admin)
```http
GET /api/orders/stats
Authorization: Bearer {token}
```

**Roles:** ADMIN

**Response (200):**
```json
{
  "totalOrders": 150,
  "totalRevenue": 45000.00,
  "ordersByStatus": {
    "PENDING": 10,
    "PAID": 50,
    "SHIPPED": 30,
    "DELIVERED": 55,
    "CANCELLED": 5
  }
}
```

### Rastrear Pedido
```http
GET /api/orders/:id/track
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "order": {
    "id": "uuid",
    "status": "SHIPPED",
    "total": 150.00,
    "createdAt": "2025-11-25T00:00:00.000Z"
  },
  "timeline": [
    {
      "status": "PENDING",
      "date": "2025-11-25T00:00:00.000Z",
      "description": "Pedido realizado",
      "completed": true
    },
    {
      "status": "PAID",
      "date": "2025-11-25T01:00:00.000Z",
      "description": "Pagamento confirmado",
      "completed": true
    },
    {
      "status": "SHIPPED",
      "date": "2025-11-26T00:00:00.000Z",
      "description": "Pedido enviado",
      "completed": true
    },
    {
      "status": "DELIVERED",
      "description": "Pedido entregue",
      "completed": false
    }
  ]
}
```

### Atualizar Pedido (Admin)
```http
PUT /api/orders/:id
Authorization: Bearer {token}
```

**Roles:** ADMIN

**Body:**
```json
{
  "status": "SHIPPED",
  "shippingAddress": "Nova rua, 123 - São Paulo, SP"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "status": "SHIPPED",
  "shippingAddress": "Nova rua, 123 - São Paulo, SP",
  "total": 150.00,
  "updatedAt": "2025-11-26T00:00:00.000Z"
}
```

### Cancelar Pedido
```http
PUT /api/orders/:id/cancel
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": "uuid",
  "status": "CANCELLED",
  "total": 150.00,
  "updatedAt": "2025-11-26T00:00:00.000Z"
}
```

**Errors:**
- `403` - Forbidden: Apenas o dono do pedido pode cancelá-lo
- `400` - Bad Request: Pedido não pode ser cancelado (já foi enviado/entregue)

### Deletar Pedido (Admin)
```http
DELETE /api/orders/:id
Authorization: Bearer {token}
```

**Roles:** ADMIN

**Response (200):**
```json
{
  "message": "Pedido deletado com sucesso"
}
```

---

## 📝 Credenciais de Teste

### Usuário Admin
```
Email: admin@guaranatatto.com
Senha: admin123
```

### Usuário Comum
```
Email: user@test.com
Senha: user123
```

---

## ⚠️ Códigos de Erro Comuns

- `400` - Bad Request (dados inválidos)
- `401` - Unauthorized (token ausente ou inválido)
- `403` - Forbidden (sem permissão)
- `404` - Not Found (recurso não encontrado)
- `409` - Conflict (email já cadastrado, etc)
- `500` - Internal Server Error

**Formato de erro:**
```json
{
  "statusCode": 400,
  "message": "Descrição do erro",
  "error": "Bad Request"
}
```

---

## 🚀 Como Usar

1. **Autenticação**: Faça login ou registro para obter o token
2. **Headers**: Inclua o token em todas as requisições protegidas:
   ```javascript
   headers: {
     'Authorization': `Bearer ${token}`,
     'Content-Type': 'application/json'
   }
   ```
3. **CORS**: O backend aceita requisições de:
   - `http://localhost:4200` (Angular)
   - `https://leandrolorente.github.io` (Deploy)

---

## 📞 Suporte

- Backend rodando em: `http://localhost:3000/api`
- Prisma Studio: `http://localhost:5555`
- Database: PostgreSQL em `localhost:5432`

# 📋 Changelog da API - Alinhamento Backend/Frontend

**Data:** 26 de novembro de 2025  
**Versão:** 2.0.0

## 🎯 Resumo

O backend foi completamente reestruturado para alinhar os contratos da API com as interfaces do frontend, eliminando a necessidade de conversões e transformações de dados no lado do cliente.

---

## 🔄 Mudanças por Endpoint

### 1. **GET /api/products** e **GET /api/products/:id**

#### Mudanças no Response:
```diff
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": number,
  "category": "CLOTHING" | "ACCESSORIES" | "CARE" | "ART",
- "imageUrl": "string",
+ "images": ["string"],
  "stock": number,
+ "rating": number,              // ⭐ NOVO - Calculado automaticamente (média das avaliações)
+ "reviewCount": number,         // ⭐ NOVO - Contagem total de avaliações
+ "discountPrice": number | null, // ⭐ NOVO - Preço com desconto (opcional)
+ "specifications": object | null, // ⭐ NOVO - Especificações técnicas em JSON (opcional)
  "createdAt": "string",
  "updatedAt": "string"
}
```

#### Exemplo de Response Atualizado:
```json
{
  "id": "prod-1",
  "name": "Camiseta Tattoo Art",
  "description": "Camiseta 100% algodão com estampa exclusiva",
  "price": 89.90,
  "category": "CLOTHING",
  "images": [
    "https://example.com/camiseta-front.jpg",
    "https://example.com/camiseta-back.jpg"
  ],
  "stock": 50,
  "rating": 4.5,
  "reviewCount": 12,
  "discountPrice": 69.90,
  "specifications": {
    "material": "100% Algodão",
    "sizes": ["P", "M", "G", "GG"],
    "colors": ["Preto", "Branco", "Cinza"]
  },
  "createdAt": "2025-11-26T10:00:00Z",
  "updatedAt": "2025-11-26T10:00:00Z"
}
```

---

### 2. **GET /api/tattoos** e **GET /api/tattoos/:id**

#### Mudanças no Response:
```diff
{
  "id": "string",
- "title": "string",
+ "name": "string",              // ⚠️ RENOMEADO
  "description": "string",
- "imageUrl": "string",
+ "images": ["string"],           // ⚠️ MUDOU DE STRING PARA ARRAY
  "bodyArea": "ARM" | "LEG" | "BACK" | "CHEST" | "SHOULDER" | "NECK" | "HAND" | "FOOT" | "OTHER",
  "style": "string",
  "size": "string",
- "duration": number,
+ "estimatedTime": "string",     // ⚠️ RENOMEADO E MUDOU TIPO (ex: "4h", "2-3h")
- "price": number,
+ "estimatedPrice": number,      // ⚠️ RENOMEADO
- "isActive": boolean,
+ "isAvailable": boolean,        // ⚠️ RENOMEADO
+ "artist": "string",            // ⭐ NOVO - Nome do artista
+ "difficulty": "EASY" | "MEDIUM" | "HARD", // ⭐ NOVO
+ "tags": ["string"],            // ⭐ NOVO - Ex: ["realismo", "colorido"]
+ "colors": ["string"],          // ⭐ NOVO - Ex: ["preto", "vermelho"]
  "createdAt": "string",
  "updatedAt": "string"
}
```

#### Exemplo de Response Atualizado:
```json
{
  "id": "tattoo-1",
  "name": "Leão Realista",
  "description": "Tatuagem de leão em estilo realista",
  "images": [
    "https://example.com/leao-1.jpg",
    "https://example.com/leao-2.jpg"
  ],
  "bodyArea": "ARM",
  "style": "Realismo",
  "size": "Grande (20x30cm)",
  "estimatedTime": "6-8h",
  "estimatedPrice": 1500.00,
  "isAvailable": true,
  "artist": "Carlos Mendes",
  "difficulty": "HARD",
  "tags": ["realismo", "animal", "preto e cinza"],
  "colors": ["preto", "cinza"],
  "createdAt": "2025-11-26T10:00:00Z",
  "updatedAt": "2025-11-26T10:00:00Z"
}
```

---

### 3. **GET /api/studio/stats**

#### Mudanças no Response:
```diff
- {
-   "stats": {
-     "totalTattoos": number,
-     "totalProducts": number,
-     "totalBookings": number
-   }
- }

+ {
+   "yearsExperience": number,    // ⭐ NOVO - Anos de experiência do estúdio
+   "satisfiedClients": number,   // ⭐ NOVO - Total de clientes atendidos (bookings completos)
+   "artistsCount": number,        // ⭐ NOVO - Quantidade de artistas no estúdio
+   "awardsCount": number          // ⭐ NOVO - Quantidade de prêmios conquistados
+ }
```

#### Exemplo de Response Atualizado:
```json
{
  "yearsExperience": 6,
  "satisfiedClients": 245,
  "artistsCount": 5,
  "awardsCount": 10
}
```

**⚠️ Nota Importante:** 
- `yearsExperience` está fixo em **6 anos** (pode ser configurado no futuro)
- `awardsCount` está fixo em **10 prêmios** (pode ser configurado no futuro)
- `satisfiedClients` é calculado dinamicamente (conta bookings com status `COMPLETED`)
- `artistsCount` será calculado dinamicamente quando o sistema de artistas for implementado (atualmente retorna contagem de tattoos únicas)

---

### 4. **GET /api/reviews** (Depoimentos/Testimonials)

#### Query Parameters:
- `featured=true` - Retorna apenas reviews em destaque

#### Mudanças no Response:
```diff
- [
-   {
-     "id": "string",
-     "userId": "string",
-     "productId": "string",
-     "tattooId": "string",
-     "rating": number,
-     "comment": "string",
-     "createdAt": "string"
-   }
- ]

+ [
+   {
+     "customerName": "string",      // ⭐ NOVO - Nome do cliente (vem de user.name)
+     "customerPhoto": "string",     // ⭐ NOVO - Foto do cliente (vem de user.avatar)
+     "rating": number,
+     "comment": "string",
+     "date": "string",              // ⚠️ RENOMEADO (era createdAt)
+     "service": "string"            // ⭐ NOVO - Nome do serviço avaliado
+   }
+ ]
```

#### Exemplo de Response Atualizado:
```json
[
  {
    "customerName": "João Silva",
    "customerPhoto": "https://i.pravatar.cc/150?img=1",
    "rating": 5,
    "comment": "Trabalho impecável! Superou minhas expectativas.",
    "date": "2025-11-26T10:00:00.000Z",
    "service": "Tatuagem Leão Realista"
  },
  {
    "customerName": "Maria Santos",
    "customerPhoto": "https://i.pravatar.cc/150?img=2",
    "rating": 5,
    "comment": "Produto de excelente qualidade, recomendo!",
    "date": "2025-11-25T15:30:00.000Z",
    "service": "Camiseta Tattoo Art"
  }
]
```

**⚠️ Nota Importante:**
- A propriedade `service` contém o nome do produto ou tatuagem avaliado
- `customerPhoto` usa fallback para avatar padrão se o usuário não tiver foto

---

## 📊 Mudanças no Banco de Dados

### Schema do Prisma Atualizado:

```prisma
model User {
  id          String   @id @default(uuid())
  name        String
  email       String   @unique
  password    String
  role        Role     @default(USER)
  avatar      String?  // ⭐ NOVO - URL do avatar do usuário
  // ... outros campos
}

model Product {
  id              String      @id @default(uuid())
  name            String
  description     String?
  price           Float
  category        Category
  images          String[]    // ⚠️ MUDOU - era imageUrl (String)
  stock           Int
  discountPrice   Float?      // ⭐ NOVO
  specifications  Json?       // ⭐ NOVO
  // ... outros campos
}

model Tattoo {
  id              String     @id @default(uuid())
  name            String     // ⚠️ RENOMEADO - era title
  description     String?
  images          String[]   // ⚠️ MUDOU - era imageUrl (String)
  bodyArea        BodyArea
  style           String
  size            String
  estimatedTime   String     // ⚠️ RENOMEADO - era duration (Int)
  estimatedPrice  Float      // ⚠️ RENOMEADO - era price
  isAvailable     Boolean    @default(true) // ⚠️ RENOMEADO - era isActive
  artist          String     // ⭐ NOVO
  difficulty      Difficulty @default(MEDIUM) // ⭐ NOVO
  tags            String[]   // ⭐ NOVO
  colors          String[]   // ⭐ NOVO
  // ... outros campos
}

model Review {
  id          String   @id @default(uuid())
  userId      String
  productId   String?
  tattooId    String?
  rating      Int
  comment     String
  service     String?  // ⭐ NOVO - Nome do serviço avaliado
  // ... outros campos
}

// ⭐ NOVO Enum
enum Difficulty {
  EASY
  MEDIUM
  HARD
}
```

---

## 🔧 DTOs Atualizados

### CreateProductDto
```typescript
{
  name: string;
  description?: string;
  price: number;
  category: "CLOTHING" | "ACCESSORIES" | "CARE" | "ART";
  images: string[];           // ⚠️ MUDOU - era imageUrl
  stock: number;
  discountPrice?: number;     // ⭐ NOVO
  specifications?: object;    // ⭐ NOVO
}
```

### CreateTattooDto
```typescript
{
  name: string;               // ⚠️ RENOMEADO - era title
  description?: string;
  images: string[];           // ⚠️ MUDOU - era imageUrl
  bodyArea: string;
  style: string;
  size: string;
  estimatedTime: string;      // ⚠️ RENOMEADO e MUDOU TIPO - era duration (number)
  estimatedPrice: number;     // ⚠️ RENOMEADO - era price
  artist: string;             // ⭐ NOVO
  difficulty?: "EASY" | "MEDIUM" | "HARD"; // ⭐ NOVO
  tags?: string[];            // ⭐ NOVO
  colors?: string[];          // ⭐ NOVO
  isAvailable?: boolean;      // ⚠️ RENOMEADO - era isActive
}
```

---

## 🚀 Como Adaptar o Frontend

### 1. **Produtos**
✅ **Remover conversores de dados** - A API já retorna no formato correto  
✅ **Atualizar interfaces** - `imageUrl` → `images[]`  
✅ **Usar campos novos** - `rating`, `reviewCount`, `discountPrice`, `specifications`

```typescript
// ❌ ANTES - Precisava converter
const imageUrl = product.imageUrl || product.images?.[0];

// ✅ AGORA - Usar diretamente
const images = product.images; // Sempre será array
const mainImage = product.images[0];
```

### 2. **Tatuagens**
✅ **Atualizar nomes de campos**:
- `title` → `name`
- `imageUrl` → `images[]`
- `duration` → `estimatedTime`
- `price` → `estimatedPrice`
- `isActive` → `isAvailable`

✅ **Usar novos campos** - `artist`, `difficulty`, `tags[]`, `colors[]`

```typescript
// ❌ ANTES
interface Tattoo {
  title: string;
  imageUrl: string;
  duration: number;
  price: number;
  isActive: boolean;
}

// ✅ AGORA
interface Tattoo {
  name: string;
  images: string[];
  estimatedTime: string;
  estimatedPrice: number;
  isAvailable: boolean;
  artist: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  tags: string[];
  colors: string[];
}
```

### 3. **Studio Stats**
✅ **Atualizar interface completamente** - Estrutura mudou 100%

```typescript
// ❌ ANTES
interface StudioStats {
  stats: {
    totalTattoos: number;
    totalProducts: number;
    totalBookings: number;
  }
}

// ✅ AGORA
interface StudioStats {
  yearsExperience: number;
  satisfiedClients: number;
  artistsCount: number;
  awardsCount: number;
}
```

### 4. **Depoimentos/Reviews**
✅ **Usar endpoint `/api/reviews?featured=true`** para página inicial  
✅ **Remover conversores** - API já retorna no formato Testimonial

```typescript
// ❌ ANTES - Precisava transformar
const testimonials = reviews.map(review => ({
  customerName: review.user.name,
  customerPhoto: review.user.avatar,
  rating: review.rating,
  comment: review.comment,
  date: review.createdAt,
  service: review.product?.name || review.tattoo?.name
}));

// ✅ AGORA - Usar diretamente
const testimonials = await fetch('/api/reviews?featured=true');
// Já vem no formato correto!
```

---

## 📦 Dados de Exemplo (Seed)

O banco foi populado com dados de exemplo incluindo:
- ✅ **4 produtos** com imagens múltiplas, descontos e especificações
- ✅ **5 tatuagens** com todos os novos campos preenchidos
- ✅ **3 reviews** vinculadas a produtos e tatuagens
- ✅ **1 usuário admin** e **1 usuário comum** com avatares

---

## ⚠️ Breaking Changes

**IMPORTANTE:** Esta é uma atualização com mudanças incompatíveis (breaking changes). O frontend precisará ser atualizado para funcionar corretamente.

### Checklist de Migração:

- [ ] Atualizar interfaces TypeScript para Products
- [ ] Atualizar interfaces TypeScript para Tattoos
- [ ] Atualizar interface TypeScript para StudioStats
- [ ] Atualizar interface TypeScript para Testimonials
- [ ] Remover conversores/transformações de dados
- [ ] Atualizar componentes que exibem produtos (usar `images[]`)
- [ ] Atualizar componentes que exibem tatuagens (novos campos)
- [ ] Atualizar componentes de estatísticas do estúdio
- [ ] Atualizar componentes de depoimentos
- [ ] Testar formulários de criação/edição
- [ ] Atualizar testes unitários e de integração

---

## 📞 Suporte

Para dúvidas sobre a implementação, consulte:
- **API Documentation:** `API_DOCUMENTATION.md`
- **Schema do Banco:** `prisma/schema.prisma`
- **Seed de Exemplo:** `prisma/seed.ts`

---

## 🎉 Benefícios

✅ **Menos código no frontend** - Não precisa mais converter dados  
✅ **Melhor performance** - Campos calculados no backend  
✅ **Type-safe** - Contratos alinhados entre front e back  
✅ **Manutenção facilitada** - Uma única fonte de verdade  
✅ **Melhor DX** - Menos bugs de integração

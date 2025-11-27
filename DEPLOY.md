# GuaranaTatto Backend - Guia de Deploy

## 🚀 Opções de Deploy

### Opção 1: Railway (Recomendado - Gratuito)

#### Passo 1: Criar conta no Railway
1. Acesse [railway.app](https://railway.app)
2. Faça login com sua conta GitHub

#### Passo 2: Deploy automático
1. Clique em "New Project"
2. Selecione "Deploy from GitHub repo"
3. Escolha o repositório `e-commerce-backend`
4. Railway detectará automaticamente o `railway.json`

#### Passo 3: Adicionar banco de dados PostgreSQL
1. No projeto, clique em "New"
2. Selecione "Database" → "PostgreSQL"
3. Railway criará automaticamente a variável `DATABASE_URL`

#### Passo 4: Configurar variáveis de ambiente
No painel do Railway, adicione:
```
NODE_ENV=production
JWT_SECRET=seu-secret-super-seguro-aqui
CORS_ORIGIN=https://seu-frontend.vercel.app,http://localhost:4200
PORT=3000
```

#### Passo 5: Gerar domínio público
1. Nas configurações do serviço
2. Clique em "Generate Domain"
3. Copie a URL (ex: `https://seu-app.railway.app`)

---

### Opção 2: Render (Gratuito)

#### Passo 1: Criar conta no Render
1. Acesse [render.com](https://render.com)
2. Faça login com GitHub

#### Passo 2: Criar banco PostgreSQL
1. New → PostgreSQL
2. Nome: `guarana-tattoo-db`
3. Copie a "Internal Database URL"

#### Passo 3: Criar Web Service
1. New → Web Service
2. Conecte ao repositório GitHub
3. Configurações:
   - **Name**: `guarana-tattoo-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm run start:migrate:prod`

#### Passo 4: Variáveis de ambiente
```
NODE_ENV=production
DATABASE_URL=[Cole a Internal Database URL]
JWT_SECRET=seu-secret-super-seguro-aqui
CORS_ORIGIN=https://seu-frontend.vercel.app
PORT=10000
```

---

### Opção 3: Vercel (Para testes - Serverless)

⚠️ **Limitação**: Vercel é serverless, não ideal para WebSockets ou conexões persistentes.

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Configure no arquivo `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/main.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/main.js"
    }
  ]
}
```

---

## 🔐 Secrets do GitHub Actions

Para CI/CD funcionar, adicione nos **Settings → Secrets and variables → Actions**:

### Para Railway:
- `RAILWAY_TOKEN`: Token de API do Railway (em Account Settings → Tokens)

### Para Render:
- `RENDER_SERVICE_ID`: ID do serviço (na URL do dashboard)
- `RENDER_API_KEY`: API Key (em Account Settings → API Keys)

---

## 🌐 Consumir no Frontend

Depois do deploy, atualize no seu frontend Angular:

### environment.prod.ts
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://seu-backend.railway.app/api' // ou .onrender.com
};
```

### CORS
Certifique-se que o `CORS_ORIGIN` no backend inclui a URL do seu frontend:
```
CORS_ORIGIN=https://seu-frontend.vercel.app,https://outro-dominio.com
```

---

## 📦 Checklist antes do deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados PostgreSQL criado
- [ ] `DATABASE_URL` apontando para o banco correto
- [ ] `JWT_SECRET` forte e único
- [ ] `CORS_ORIGIN` com domínios permitidos
- [ ] Migrations do Prisma aplicadas
- [ ] Tests passando localmente (`npm test`)
- [ ] Build funcionando (`npm run build`)

---

## 🐛 Troubleshooting

### Erro de migração do Prisma
```bash
# No Railway/Render, adicione nas variáveis:
DATABASE_URL=postgresql://...?schema=public&sslmode=require
```

### Erro de CORS
Verifique se o domínio do frontend está em `CORS_ORIGIN`:
```
CORS_ORIGIN=https://frontend.vercel.app,http://localhost:4200
```

### Erro de conexão com banco
- Railway: Use a variável automática `DATABASE_URL`
- Render: Copie a "Internal Database URL"

---

## 📝 URLs de Exemplo

Depois do deploy, suas URLs serão:

- **Railway**: `https://e-commerce-backend-production.up.railway.app/api`
- **Render**: `https://guarana-tattoo-backend.onrender.com/api`

Teste a API:
```bash
curl https://sua-url.railway.app/api
```

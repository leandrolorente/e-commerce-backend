# 🚀 Como Rodar o Projeto - Guia Rápido

## ❌ Problema Atual
O erro `Cannot read properties of undefined (reading '__internal')` indica que o **banco de dados PostgreSQL não está configurado**.

## ✅ Solução - 3 Opções

### Opção 1: Docker (RECOMENDADO - Mais Fácil)

1. Instale o Docker Desktop: https://www.docker.com/products/docker-desktop/

2. Rode o PostgreSQL via Docker:
```powershell
docker run --name postgres-tattoo -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=tattoo_db -p 5432:5432 -d postgres
```

3. Depois execute:
```powershell
npm run prisma:migrate
npm run start:dev
```

---

### Opção 2: PostgreSQL Local

1. Baixe e instale o PostgreSQL: https://www.postgresql.org/download/windows/

2. Durante a instalação:
   - Senha do usuário `postgres`: **postgres**
   - Porta: **5432**

3. Crie o banco de dados:
```powershell
# Abra o PowerShell como Admin e rode:
psql -U postgres
CREATE DATABASE tattoo_db;
\q
```

4. Execute:
```powershell
npm run prisma:migrate
npm run start:dev
```

---

### Opção 3: Banco Online GRÁTIS (Supabase)

1. Crie conta grátis: https://supabase.com/

2. Crie um novo projeto

3. Vá em **Settings** → **Database** → Copie a "Connection string"

4. Cole no arquivo `.env`:
```env
DATABASE_URL="postgresql://postgres:[SUA-SENHA]@[SEU-HOST]:5432/postgres"
```

5. Execute:
```powershell
npm run prisma:migrate
npm run start:dev
```

---

## 📝 Comandos Úteis

```powershell
# Ver status do Docker PostgreSQL
docker ps

# Parar o PostgreSQL
docker stop postgres-tattoo

# Iniciar novamente
docker start postgres-tattoo

# Ver logs
docker logs postgres-tattoo

# Remover container
docker rm -f postgres-tattoo
```

---

## 🎯 Após Configurar o Banco

```powershell
# 1. Gerar Prisma Client
npm run prisma:generate

# 2. Criar tabelas no banco
npm run prisma:migrate

# 3. Popular com dados de teste (opcional)
npm run prisma:seed

# 4. Iniciar servidor
npm run start:dev
```

Servidor estará rodando em: **http://localhost:3000**

---

## 🔑 Credenciais de Teste (após seed)

- **Admin**: admin@tattoo.com / admin123
- **User**: user@tattoo.com / user123

---

## 📌 Arquivos Importantes

- `.env` - Variáveis de ambiente (configure DATABASE_URL aqui)
- `prisma/schema.prisma` - Schema do banco de dados
- `src/main.ts` - Entrada da aplicação

---

## ❓ Problemas Comuns

### "Port 5432 already in use"
```powershell
# Algum PostgreSQL já está rodando, use ele ou mude a porta
```

### "Connection refused"
```powershell
# PostgreSQL não está rodando, inicie o serviço
docker start postgres-tattoo
```

### "Database does not exist"
```powershell
# Rode as migrations
npm run prisma:migrate
```

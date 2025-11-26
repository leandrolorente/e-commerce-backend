# 🎨 GuaranaTattoShop - Backend

Backend completo em **NestJS** para e-commerce de tatuagens e produtos.

## 🚀 Tecnologias

- **NestJS** - Framework Node.js
- **Prisma** - ORM TypeScript
- **PostgreSQL** - Database
- **JWT** - Autenticação
- **Cloudinary** - Upload de imagens
- **MercadoPago** - Pagamentos
- **SendGrid** - Emails

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npm run prisma:generate

# Criar database e migrations
npm run prisma:migrate

# Popular com dados de teste
npm run prisma:seed
```

## ⚙️ Configuração

Crie um arquivo `.env` baseado no `.env.example`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/guaranatatto"
JWT_SECRET="sua-chave-secreta"
CLOUDINARY_CLOUD_NAME="seu-cloud-name"
CLOUDINARY_API_KEY="sua-api-key"
CLOUDINARY_API_SECRET="seu-api-secret"
MERCADOPAGO_ACCESS_TOKEN="seu-token"
SENDGRID_API_KEY="sua-api-key"
```

## 🏃 Executar

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod

# Prisma Studio
npm run prisma:studio
```

## 📡 Endpoints Principais

### Autenticação
- `POST /api/auth/register` - Registrar
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Perfil

### Produtos
- `GET /api/products` - Listar
- `POST /api/products` - Criar (ADMIN)

### Tatuagens
- `GET /api/tattoos` - Listar
- `POST /api/tattoos` - Criar (ADMIN)

### Agendamentos
- `POST /api/bookings` - Criar
- `GET /api/bookings` - Listar

### Pedidos
- `POST /api/orders` - Criar
- `GET /api/orders` - Listar

## 👤 Usuários de Teste

```
Admin: admin@guaranatatto.com / admin123
User:  user@test.com / user123
```

## 📝 Scripts Úteis

```bash
npm run start:dev          # Rodar em desenvolvimento
npm run build              # Build para produção
npm run prisma:generate    # Gerar Prisma Client
npm run prisma:migrate     # Criar migrations
npm run prisma:seed        # Popular database
npm run prisma:studio      # Abrir Prisma Studio
```

## 🏗️ Estrutura do Projeto

```
src/
├── auth/           # Autenticação JWT
├── prisma/         # Database ORM
├── products/       # Produtos
├── tattoos/        # Tatuagens
├── bookings/       # Agendamentos
├── orders/         # Pedidos
├── payments/       # Pagamentos
├── upload/         # Upload de imagens
├── email/          # Envio de emails
└── common/         # Guards, Decorators
```

## 📚 Documentação Completa

Veja **SETUP_COMPLETO.md** para guia detalhado de setup e deploy.

---

Desenvolvido com ❤️ usando [NestJS](https://nestjs.com/)
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

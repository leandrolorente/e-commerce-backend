import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductsModule } from './products/products.module';
import { TattoosModule } from './tattoos/tattoos.module';
import { BookingsModule } from './bookings/bookings.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { UploadModule } from './upload/upload.module';
import { EmailModule } from './email/email.module';
import { StudioModule } from './studio/studio.module';
import { ReviewsModule } from './reviews/reviews.module';

// Módulos completos para GuaranaTattoShop Backend
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    ProductsModule,
    TattoosModule,
    BookingsModule,
    OrdersModule,
    PaymentsModule,
    UploadModule,
    EmailModule,
    StudioModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

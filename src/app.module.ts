import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { AppController } from './app.controller';
import { CoreModule } from './core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { CanteenModule } from './modules/canteen/canteen.module';
import { ChatModule } from './modules/chat/chat.module';
import { HealthModule } from './modules/health/health.module';
import { PaymentModule } from './modules/payment/payment.module';
import { TodoModule } from './modules/todo/todo.module';
import { UserModule } from './modules/user/user.module';
import { WorkscheduleModule } from './modules/workschedule/workschedule.module';

@Module({
  imports: [
    CoreModule,
    HealthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PassportModule.register({ defaultStrategy: 'jwt-1gio' }),
    AuthModule,
    UserModule,
    ChatModule,
    TodoModule,
    WorkscheduleModule,
    CanteenModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

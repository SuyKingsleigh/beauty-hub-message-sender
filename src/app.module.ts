import { Module } from '@nestjs/common';
import { EventsListenerModule } from './events-listener.module';
import { EmailModule } from './infrastructure/email/email.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    EventsListenerModule,
    EmailModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}

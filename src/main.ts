import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'appointment.created', // tem que ser IGUAL ao do publisher
        queueOptions: {
          durable: true,
        },
        noAck: false,
      },
    },
  );

  await app.listen();
}

bootstrap();

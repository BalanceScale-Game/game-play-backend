import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'king-diamond',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'king-diamond-consumer',
      },
    },
  });
  app.useStaticAssets(join(__dirname, '..', 'static'));
  await app.listen(8080);
  await app.startAllMicroservices();
}
bootstrap();

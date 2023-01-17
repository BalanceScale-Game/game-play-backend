import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './modules/socket/socket.module';
import { KafkaModule } from './modules/kafka/kafka.module';

@Module({
  imports: [SocketModule, KafkaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

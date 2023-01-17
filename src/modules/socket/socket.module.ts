import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketController } from './socket.controller';
import { KafkaModule } from '../kafka/kafka.module';
import { SocketService } from './socket.service';

@Module({
  imports: [KafkaModule],
  providers: [SocketGateway, SocketService],
  controllers: [SocketController],
})
export class SocketModule {}

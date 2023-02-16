import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketController } from './socket.controller';
import { KafkaModule } from '../kafka/kafka.module';
import { SocketService } from './socket.service';
import { GamePlayModule } from '../game-play/gamePlay.module';

@Module({
  imports: [KafkaModule, GamePlayModule],
  providers: [SocketGateway, SocketService],
  controllers: [SocketController],
})
export class SocketModule {}

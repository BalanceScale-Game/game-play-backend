import { Module } from '@nestjs/common';
import { GamePlayService } from './gamePlay.service';
import { TaskSchedulingModule } from '../task-scheduling/taskScheduling.module';
import { RoomManagerService } from './roomManager.service';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [TaskSchedulingModule, KafkaModule],
  exports: [GamePlayService, RoomManagerService],
  providers: [GamePlayService, RoomManagerService],
})
export class GamePlayModule {}
